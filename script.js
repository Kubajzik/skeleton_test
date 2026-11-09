import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 1. ROZŘAZENÍ VŠECH KOSTÍ V MODELU kostra.glb DO KATEGORIÍ PRO FILTR
const skupinyCastiTela = {
    "Lebka": [
        "FMA52734", "FMA52735", "FMA52736", "FMA52738", "FMA52739", "FMA52740",
        "FMA52748", "FMA52749", "FMA52788", "FMA52789", "FMA52892", "FMA52893",
        "FMA53645", "FMA53646", "FMA53647", "FMA53648", "FMA53649", "FMA53650",
        "FMA53655", "FMA53656", "FMA54737", "FMA54738", "FMA9710"
    ],
    "Páteř": [
        "FMA12519", "FMA12520", "FMA12521", "FMA12522", "FMA12523", "FMA12524", "FMA12525",
        "FMA9165", "FMA9187", "FMA9209", "FMA9248", "FMA9922", "FMA9945", "FMA9968", "FMA9991",
        "FMA10014", "FMA10037", "FMA10059", "FMA10081",
        "FMA13072", "FMA13073", "FMA13074", "FMA13075", "FMA13076", "FMA16202"
    ],
    "Hrudník": [
        "FMA7486", "FMA7487", "FMA7488",
        "FMA7857", "FMA7882", "FMA7909", "FMA7957", "FMA7987", "FMA8012", "FMA8039", "FMA8066",
        "FMA8093", "FMA8148", "FMA8175", "FMA8202", "FMA8229", "FMA8256", "FMA8283", "FMA8310",
        "FMA8364", "FMA8391", "FMA8445", "FMA8472", "FMA8531", "FMA8532", "FMA8533", "FMA8534"
    ],
    "Pánev": [
        "FMA16586", "FMA16587", "FMA16202"
    ],
    "Horní končetina": [
        "FMA13322", "FMA13323", "FMA13395", "FMA13396", "FMA23130", "FMA23131",
        "FMA23464", "FMA23465", "FMA23467", "FMA23468", "FMA23725",
        "FMA23938", "FMA23940", "FMA23942", "FMA23944", "FMA23951", "FMA23953", "FMA23955", "FMA23957", "FMA23959",
        "FMA24435", "FMA24436", "FMA24437", "FMA24438", "FMA24439", "FMA24440", "FMA24441", "FMA24442",
        "FMA24443", "FMA24444", "FMA24445", "FMA24446", "FMA24447", "FMA24448", "FMA24449", "FMA24450",
        "FMA24451", "FMA24452", "FMA24453", "FMA24454", "FMA24455", "FMA24456", "FMA24457", "FMA24458",
        "FMA24459", "FMA24460", "FMA24461", "FMA24462", "FMA24463", "FMA24464", "FMA24465", "FMA24466",
        "FMA24467", "FMA24468", "FMA24469", "FMA24470", "FMA24471", "FMA24472", "FMA24473",
        "FMA65470", "FMA66791", "FMA71908", "FMA71915", "FMA71916"
    ],
    "Dolní končetina": [
        "FMA24474", "FMA24475", "FMA24477", "FMA24478", "FMA24480", "FMA24481",
        "FMA24482", "FMA24483", "FMA24486", "FMA24487", "FMA24497", "FMA24498", "FMA24500", "FMA24501",
        "FMA24507", "FMA24508", "FMA24509", "FMA24510", "FMA24511", "FMA24512", "FMA24513", "FMA24514",
        "FMA24515", "FMA24516", "FMA24521", "FMA24522", "FMA24523", "FMA24524", "FMA24525", "FMA24526",
        "FMA24528", "FMA24529", "FMA230986", "FMA230988",
        "FMA32634", "FMA32635", "FMA32636", "FMA32637", "FMA32638", "FMA32639", "FMA32640", "FMA32641",
        "FMA32642", "FMA32643", "FMA32644", "FMA32645", "FMA32646", "FMA32647", "FMA32650", "FMA32651",
        "FMA32652", "FMA32653", "FMA32654", "FMA32655", "FMA32656", "FMA32657", "FMA32658", "FMA32659",
        "FMA43253", "FMA43254", "FMA45097", "FMA45098"
    ]
};

// 2. DETAILNÍ POPISKY JEDNOTLIVÝCH KOSTÍ
const kostiData = {
    // Lebka
    "FMA52734": { nazev: "Kost čelní (Os frontale)", popis: "Tvoří podklad čela a horní stěnu očnic." },
    "FMA52788": { nazev: "Kost temenní pravá (Os parietale)", popis: "Párová kost tvořící vrchol a boky mozkovny." },
    "FMA52789": { nazev: "Kost temenní levá (Os parietale)", popis: "Párová kost tvořící vrchol a boky mozkovny." },
    "FMA52735": { nazev: "Kost týlní (Os occipitale)", popis: "Tvoří zadní a spodní část lebky, obsahuje velký týlní otvor." },
    "FMA52738": { nazev: "Kost spánková pravá (Os temporale)", popis: "Obsahuje sluchové a rovnovážné ústrojí." },
    "FMA52739": { nazev: "Kost spánková levá (Os temporale)", popis: "Obsahuje sluchové a rovnovážné ústrojí." },
    "FMA53649": { nazev: "Horní čelist pravá (Maxilla)", popis: "Párová kost tvořící střední část obličeje a horní zubní oblouk." },
    "FMA53650": { nazev: "Horní čelist levá (Maxilla)", popis: "Párová kost tvořící střední část obličeje a horní zubní oblouk." },
    "FMA52748": { nazev: "Dolní čelist (Mandibula)", popis: "Jediná kloubně pohyblivá kost lebky." },

    // Trup a pánev
    "FMA7486":  { nazev: "Rukojeť hrudní kosti (Manubrium sterni)", popis: "Horní část hrudní kosti, ke které se připojují klíční kosti." },
    "FMA7487":  { nazev: "Tělo hrudní kosti (Corpus sterni)", popis: "Střední část hrudní kosti, na kterou se upínají žebra." },
    "FMA7488":  { nazev: "Mečovitý výběžek (Processus xiphoideus)", popis: "Dolní výběžek hrudní kosti." },
    "FMA16202": { nazev: "Kost křížová (Os sacrum)", popis: "Vzniká srůstem pěti křížových obratlů a tvoří zadní část pánve." },
    "FMA16586": { nazev: "Kost pánevní pravá (Os coxae)", popis: "Srostlá z kosti kyčelní, sedací a stydké." },
    "FMA16587": { nazev: "Kost pánevní levá (Os coxae)", popis: "Srostlá z kosti kyčelní, sedací a stydké." },

    // Horní končetina
    "FMA13322": { nazev: "Klíční kost pravá (Clavicula)", popis: "Spojuje lopatku s hrudní kostí." },
    "FMA13323": { nazev: "Klíční kost levá (Clavicula)", popis: "Spojuje lopatku s hrudní kostí." },
    "FMA13395": { nazev: "Lopatka pravá (Scapula)", popis: "Plochá trojúhelníková kost na zadní straně hrudníku." },
    "FMA13396": { nazev: "Lopatka levá (Scapula)", popis: "Plochá trojúhelníková kost na zadní straně hrudníku." },
    "FMA23130": { nazev: "Kost pažní pravá (Humerus)", popis: "Dlouhá kost spojující ramenní a loketní kloub." },
    "FMA23131": { nazev: "Kost pažní levá (Humerus)", popis: "Dlouhá kost spojující ramenní a loketní kloub." },
    "FMA23464": { nazev: "Kost vřetenní pravá (Radius)", popis: "Kost předloktí směřující k palci." },
    "FMA23465": { nazev: "Kost vřetenní levá (Radius)", popis: "Kost předloktí směřující k palci." },
    "FMA23467": { nazev: "Kost loketní pravá (Ulna)", popis: "Kost předloktí směřující k malíčku." },
    "FMA23468": { nazev: "Kost loketní levá (Ulna)", popis: "Kost předloktí směřující k malíčku." },

    // Dolní končetina
    "FMA24474": { nazev: "Kost stehenní pravá (Femur)", popis: "Nejdelší a nejsilnější kost v lidském těle." },
    "FMA24475": { nazev: "Kost stehenní levá (Femur)", popis: "Nejdelší a nejsilnější kost v lidském těle." },
    "FMA24486": { nazev: "Čéška pravá (Patella)", popis: "Sezamská kost chránící kolenní kloub." },
    "FMA24487": { nazev: "Čéška levá (Patella)", popis: "Sezamská kost chránící kolenní kloub." },
    "FMA24477": { nazev: "Kost holenní pravá (Tibia)", popis: "Hlavní nosná kost bérce na vnitřní straně." },
    "FMA24478": { nazev: "Kost holenní levá (Tibia)", popis: "Hlavní nosná kost bérce na vnitřní straně." },
    "FMA24480": { nazev: "Kost lýtková pravá (Fibula)", popis: "Tenčí kost bérce na vnější straně." },
    "FMA24481": { nazev: "Kost lýtková levá (Fibula)", popis: "Tenčí kost bérce na vnější straně." }
};

// Pomocná funkce, která zjistí kategorii jakékoliv kosti podle jejího ID
function ziskejKategorii(idKosti) {
    for (const [kategorie, seznamId] of Object.entries(skupinyCastiTela)) {
        if (seznamId.includes(idKosti)) return kategorie;
    }
    return "Ostatní";
}

// 3. ZÁKLADNÍ NASTAVENÍ 3D SCÉNY
const container = document.getElementById('model-viewport');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(0, 0, 220);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

scene.add(new THREE.AmbientLight(0xffffff, 0.7));
const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
dirLight.position.set(50, 100, 150);
scene.add(dirLight);

const VYCHOZI_BARVA = 0xe5e7eb;
const VYBRANA_BARVA = 0x3b82f6;
let vybranaKost = null;
let nactenyModel = null;

// 4. NAČTENÍ MODELU kostra.glb
const loader = new GLTFLoader();
loader.load('kostra.glb', (gltf) => {
    nactenyModel = gltf.scene;

    nactenyModel.traverse((child) => {
        if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({
                color: VYCHOZI_BARVA,
                roughness: 0.55,
                metalness: 0.05
            });
        }
    });

    scene.add(nactenyModel);
});

// 5. FILTROVÁNÍ ČÁSTÍ TĚLA A VYCENTROVÁNÍ KAMERY
function aplikujFiltr(kategorie) {
    if (!nactenyModel) return;

    const box = new THREE.Box3();

    nactenyModel.traverse((child) => {
        if (child.isMesh) {
            if (kategorie === "Vše") {
                child.visible = true;
            } else {
                const povoleneKosti = skupinyCastiTela[kategorie] || [];
                child.visible = povoleneKosti.includes(child.name);
            }

            if (child.visible) {
                box.expandByObject(child);
            }
        }
    });

    // Automatické vycentrování a přiblížení kamery na zobrazenou část
    if (!box.isEmpty()) {
        const stred = box.getCenter(new THREE.Vector3());
        const velikost = box.getSize(new THREE.Vector3());
        const maxRozmer = Math.max(velikost.x, velikost.y, velikost.z);

        controls.target.copy(stred);
        camera.position.set(stred.x, stred.y, stred.z + maxRozmer * 1.4 + 15);
        controls.update();
    }
}

// Napojení kliknutí na filtrační tlačítka
const tlacitkaFiltru = document.querySelectorAll('.filter-btn');
tlacitkaFiltru.forEach((btn) => {
    btn.addEventListener('click', () => {
        tlacitkaFiltru.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const zvolenyFiltr = btn.getAttribute('data-filter');
        aplikujFiltr(zvolenyFiltr);
    });
});

// 6. ROZLIŠENÍ KOSTI PŘI KLIKNUTÍ (Raycaster)
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let startX = 0;
let startY = 0;

container.addEventListener('pointerdown', (e) => {
    startX = e.clientX;
    startY = e.clientY;
});

container.addEventListener('pointerup', (e) => {
    if (Math.hypot(e.clientX - startX, e.clientY - startY) > 5) return;

    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    // Bereme v úvahu pouze aktuálně viditelné kosti
    const zasahy = raycaster.intersectObjects(scene.children, true).filter((z) => z.object.visible);

    if (zasahy.length > 0) {
        const kliknutaKost = zasahy[0].object;

        if (vybranaKost) {
            vybranaKost.material.color.setHex(VYCHOZI_BARVA);
        }

        vybranaKost = kliknutaKost;
        vybranaKost.material.color.setHex(VYBRANA_BARVA);

        const idKosti = kliknutaKost.name;
        const info = kostiData[idKosti];
        const kategorie = ziskejKategorii(idKosti);

        if (info) {
            document.getElementById('bone-category').textContent = kategorie;
            document.getElementById('bone-title').textContent = info.nazev;
            document.getElementById('bone-desc').textContent = info.popis;
        } else {
            document.getElementById('bone-category').textContent = kategorie + " (" + idKosti + ")";
            document.getElementById('bone-title').textContent = "Nepopsaná kost (" + idKosti + ")";
            document.getElementById('bone-desc').textContent =
                `Pro přidání popisku vlož do objektu kostiData v souboru script.js položku pod klíčem "${idKosti}".`;
        }
    }
});

// 7. PŘIZPŮSOBENÍ OKNA A VYKRESLOVACÍ SMYČKA
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