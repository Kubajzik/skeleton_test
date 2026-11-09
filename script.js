import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 1. DATABÁZE KOSTÍ (klíče odpovídají názvům částí v tvém souboru kostra.glb)
const kostiData = {
    // Lebka
    "FMA52734": { nazev: "Kost čelní (Os frontale)", kategorie: "Lebka", popis: "Tvoří podklad čela a horní stěnu očnic." },
    "FMA52788": { nazev: "Kost temenní pravá (Os parietale)", kategorie: "Lebka", popis: "Párová kost tvořící vrchol a boky mozkovny." },
    "FMA52789": { nazev: "Kost temenní levá (Os parietale)", kategorie: "Lebka", popis: "Párová kost tvořící vrchol a boky mozkovny." },
    "FMA52735": { nazev: "Kost týlní (Os occipitale)", kategorie: "Lebka", popis: "Tvoří zadní a spodní část lebky, obsahuje velký týlní otvor." },
    "FMA52738": { nazev: "Kost spánková pravá (Os temporale)", kategorie: "Lebka", popis: "Obsahuje sluchové a rovnovážné ústrojí." },
    "FMA52739": { nazev: "Kost spánková levá (Os temporale)", kategorie: "Lebka", popis: "Obsahuje sluchové a rovnovážné ústrojí." },
    "FMA53649": { nazev: "Horní čelist pravá (Maxilla)", kategorie: "Lebka", popis: "Párová kost tvořící střední část obličeje a horní zubní oblouk." },
    "FMA53650": { nazev: "Horní čelist levá (Maxilla)", kategorie: "Lebka", popis: "Párová kost tvořící střední část obličeje a horní zubní oblouk." },
    "FMA52748": { nazev: "Dolní čelist (Mandibula)", kategorie: "Lebka", popis: "Jediná kloubně pohyblivá kost lebky." },

    // Trup a pánev
    "FMA7486":  { nazev: "Rukojeť hrudní kosti (Manubrium sterni)", kategorie: "Hrudník", popis: "Horní část hrudní kosti, ke které se připojují klíční kosti." },
    "FMA7487":  { nazev: "Tělo hrudní kosti (Corpus sterni)", kategorie: "Hrudník", popis: "Střední část hrudní kosti, na kterou se upínají žebra." },
    "FMA7488":  { nazev: "Mečovitý výběžek (Processus xiphoideus)", kategorie: "Hrudník", popis: "Dolní výběžek hrudní kosti." },
    "FMA16202": { nazev: "Kost křížová (Os sacrum)", kategorie: "Páteř", popis: "Vzniká srůstem pěti křížových obratlů a tvoří zadní část pánve." },
    "FMA16586": { nazev: "Kost pánevní pravá (Os coxae)", kategorie: "Pánev", popis: "Srostlá z kosti kyčelní, sedací a stydké." },
    "FMA16587": { nazev: "Kost pánevní levá (Os coxae)", kategorie: "Pánev", popis: "Srostlá z kosti kyčelní, sedací a stydké." },

    // Horní končetina
    "FMA13322": { nazev: "Klíční kost pravá (Clavicula)", kategorie: "Horní končetina", popis: "Spojuje lopatku s hrudní kostí." },
    "FMA13323": { nazev: "Klíční kost levá (Clavicula)", kategorie: "Horní končetina", popis: "Spojuje lopatku s hrudní kostí." },
    "FMA13395": { nazev: "Lopatka pravá (Scapula)", kategorie: "Horní končetina", popis: "Plochá trojúhelníková kost na zadní straně hrudníku." },
    "FMA13396": { nazev: "Lopatka levá (Scapula)", kategorie: "Horní končetina", popis: "Plochá trojúhelníková kost na zadní straně hrudníku." },
    "FMA23130": { nazev: "Kost pažní pravá (Humerus)", kategorie: "Horní končetina", popis: "Dlouhá kost spojující ramenní a loketní kloub." },
    "FMA23131": { nazev: "Kost pažní levá (Humerus)", kategorie: "Horní končetina", popis: "Dlouhá kost spojující ramenní a loketní kloub." },
    "FMA23464": { nazev: "Kost vřetenní pravá (Radius)", kategorie: "Horní končetina", popis: "Kost předloktí směřující k palci." },
    "FMA23465": { nazev: "Kost vřetenní levá (Radius)", kategorie: "Horní končetina", popis: "Kost předloktí směřující k palci." },
    "FMA23467": { nazev: "Kost loketní pravá (Ulna)", kategorie: "Horní končetina", popis: "Kost předloktí směřující k malíčku." },
    "FMA23468": { nazev: "Kost loketní levá (Ulna)", kategorie: "Horní končetina", popis: "Kost předloktí směřující k malíčku." },

    // Dolní končetina
    "FMA24474": { nazev: "Kost stehenní pravá (Femur)", kategorie: "Dolní končetina", popis: "Nejdelší a nejsilnější kost v lidském těle." },
    "FMA24475": { nazev: "Kost stehenní levá (Femur)", kategorie: "Dolní končetina", popis: "Nejdelší a nejsilnější kost v lidském těle." },
    "FMA24486": { nazev: "Čéška pravá (Patella)", kategorie: "Dolní končetina", popis: "Sezamská kost chránící kolenní kloub." },
    "FMA24487": { nazev: "Čéška levá (Patella)", kategorie: "Dolní končetina", popis: "Sezamská kost chránící kolenní kloub." },
    "FMA24477": { nazev: "Kost holenní pravá (Tibia)", kategorie: "Dolní končetina", popis: "Hlavní nosná kost bérce na vnitřní straně." },
    "FMA24478": { nazev: "Kost holenní levá (Tibia)", kategorie: "Dolní končetina", popis: "Hlavní nosná kost bérce na vnitřní straně." },
    "FMA24480": { nazev: "Kost lýtková pravá (Fibula)", kategorie: "Dolní končetina", popis: "Tenčí kost bérce na vnější straně." },
    "FMA24481": { nazev: "Kost lýtková levá (Fibula)", kategorie: "Dolní končetina", popis: "Tenčí kost bérce na vnější straně." }
};

// 2. ZÁKLADNÍ NASTAVENÍ 3D SCÉNY
const container = document.getElementById('model-viewport');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(0, 0, 220);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// Ovládání otáčení a přibližování myší
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Osvětlení modelu
scene.add(new THREE.AmbientLight(0xffffff, 0.7));
const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
dirLight.position.set(50, 100, 150);
scene.add(dirLight);

// Barvy pro výchozí a rozkliknutou kost
const VYCHOZI_BARVA = 0xe5e7eb;
const VYBRANA_BARVA = 0x3b82f6;
let vybranaKost = null;

// 3. NAČTENÍ MODELU kostra.glb
const loader = new GLTFLoader();
loader.load('kostra.glb', (gltf) => {
    const model = gltf.scene;

    // Každé kosti vytvoříme vlastní materiál, aby šla obarvit samostatně
    model.traverse((child) => {
        if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({
                color: VYCHOZI_BARVA,
                roughness: 0.55,
                metalness: 0.05
            });
        }
    });

    scene.add(model);
});

// 4. ROZLIŠENÍ KOSTI PŘI KLIKNUTÍ (Raycaster)
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let startX = 0;
let startY = 0;

container.addEventListener('pointerdown', (e) => {
    startX = e.clientX;
    startY = e.clientY;
});

container.addEventListener('pointerup', (e) => {
    // Pokud uživatel myší táhnul (otáčel kamerou), nebereme to jako kliknutí
    if (Math.hypot(e.clientX - startX, e.clientY - startY) > 5) return;

    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const zasahy = raycaster.intersectObjects(scene.children, true);

    if (zasahy.length > 0) {
        const kliknutaKost = zasahy[0].object;

        // Vrácení původní barvy předchozí vybrané kosti
        if (vybranaKost) {
            vybranaKost.material.color.setHex(VYCHOZI_BARVA);
        }

        // Zvýraznění nově vybrané kosti
        vybranaKost = kliknutaKost;
        vybranaKost.material.color.setHex(VYBRANA_BARVA);

        // Zobrazení informací v pravém panelu
        const idKosti = kliknutaKost.name;
        const info = kostiData[idKosti];

        if (info) {
            document.getElementById('bone-category').textContent = info.kategorie;
            document.getElementById('bone-title').textContent = info.nazev;
            document.getElementById('bone-desc').textContent = info.popis;
        } else {
            document.getElementById('bone-category').textContent = "ID: " + idKosti;
            document.getElementById('bone-title').textContent = "Nepopsaná kost (" + idKosti + ")";
            document.getElementById('bone-desc').textContent =
                `Pro přidání popisku vlož do objektu kostiData v souboru script.js položku pod klíčem "${idKosti}".`;
        }
    }
});

// 5. PŘIZPŮSOBENÍ OKNA A VYKRESLOVACÍ SMYČKA
window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();