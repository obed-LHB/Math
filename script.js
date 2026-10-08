/* =========================================
   CALCULATEUR D'ÉQUATIONS DU SECOND DEGRÉ
   Logique JavaScript
   ========================================= */

// Récupération des éléments HTML
const inputA = document.getElementById("a");
const inputB = document.getElementById("b");
const inputC = document.getElementById("c");

const solveBtn = document.getElementById("solveBtn");
const resetBtn = document.getElementById("resetBtn");

const errorMessage = document.getElementById("errorMessage");

const resultSection = document.getElementById("resultSection");
const resultContent = document.getElementById("resultContent");

const stepsSection = document.getElementById("stepsSection");
const stepsContent = document.getElementById("stepsContent");

const previewA = document.getElementById("previewA");
const previewB = document.getElementById("previewB");
const previewC = document.getElementById("previewC");

const examples = document.querySelectorAll(".example");


/* =========================================
   OUTILS MATHÉMATIQUES
   ========================================= */

/**
 * Arrondit un nombre pour éviter
 * d'afficher des erreurs dues aux flottants.
 */
function cleanNumber(number) {
    if (Math.abs(number) < 1e-12) {
        return 0;
    }

    return Number(number.toFixed(12));
}


/**
 * Formate un nombre pour l'affichage.
 */
function formatNumber(number) {

    number = cleanNumber(number);

    if (Number.isInteger(number)) {
        return number.toString();
    }

    return number.toFixed(10).replace(/0+$/, "").replace(/\.$/, "");
}


/**
 * Retourne la valeur avec son signe.
 *
 * Exemple :
 * 5 → "+ 5"
 * -5 → "− 5"
 */
function signedNumber(number) {

    number = cleanNumber(number);

    if (number >= 0) {
        return "+ " + formatNumber(number);
    }

    return "− " + formatNumber(Math.abs(number));
}


/**
 * Formate une valeur au carré.
 */
function squareValue(number) {

    number = cleanNumber(number);

    if (number < 0) {
        return "(" + formatNumber(number) + ")²";
    }

    return formatNumber(number) + "²";
}


/**
 * Vérifie si un nombre est presque entier.
 */
function isInteger(number) {
    return Math.abs(number - Math.round(number)) < 1e-12;
}


/* =========================================
   RACINE CARRÉE EXACTE
   ========================================= */

/**
 * Retourne une représentation exacte
 * de √n lorsqu'elle peut être simplifiée.
 *
 * Exemple :
 * √36 → 6
 * √12 → 2√3
 */
function simplifySquareRoot(n) {

    n = Math.round(n);

    if (n === 0) {
        return "0";
    }

    const root = Math.sqrt(n);

    // Si c'est un carré parfait
    if (Number.isInteger(root)) {
        return root.toString();
    }

    let outside = 1;
    let inside = n;

    // Recherche des facteurs carrés
    for (let i = 2; i * i <= inside; i++) {

        while (inside % (i * i) === 0) {
            outside *= i;
            inside /= i * i;
        }
    }

    if (outside === 1) {
        return "√" + n;
    }

    if (inside === 1) {
        return outside.toString();
    }

    return outside + "√" + inside;
}


/* =========================================
   MISE À JOUR DE L'APERÇU
   ========================================= */

function updatePreview() {

    const a = inputA.value;
    const b = inputB.value;
    const c = inputC.value;

    previewA.textContent = a !== "" ? a : "a";

    if (b === "") {
        previewB.textContent = "+ b";
    } else {
        previewB.textContent =
            Number(b) >= 0
                ? "+ " + b
                : "− " + Math.abs(Number(b));
    }

    if (c === "") {
        previewC.textContent = "+ c";
    } else {
        previewC.textContent =
            Number(c) >= 0
                ? "+ " + c
                : "− " + Math.abs(Number(c));
    }
}


// Mise à jour en temps réel
inputA.addEventListener("input", updatePreview);
inputB.addEventListener("input", updatePreview);
inputC.addEventListener("input", updatePreview);


/* =========================================
   VALIDATION
   ========================================= */

function getCoefficients() {

    const aValue = inputA.value.trim();
    const bValue = inputB.value.trim();
    const cValue = inputC.value.trim();

    errorMessage.style.display = "none";
    errorMessage.textContent = "";

    if (aValue === "" || bValue === "" || cValue === "") {

        showError(
            "Veuillez remplir les trois coefficients a, b et c."
        );

        return null;
    }

    const a = Number(aValue);
    const b = Number(bValue);
    const c = Number(cValue);

    if (
        !Number.isFinite(a) ||
        !Number.isFinite(b) ||
        !Number.isFinite(c)
    ) {

        showError(
            "Veuillez entrer uniquement des nombres valides."
        );

        return null;
    }

    if (a === 0) {

        showError(
            "Le coefficient a doit être différent de 0. Sinon, l'équation n'est pas du second degré."
        );

        return null;
    }

    return {
        a,
        b,
        c
    };
}


function showError(message) {

    errorMessage.textContent = message;
    errorMessage.style.display = "block";

    resultSection.classList.add("hidden");
    stepsSection.classList.add("hidden");
}


/* =========================================
   RÉSOLUTION
   ========================================= */

function solveEquation() {

    const coefficients = getCoefficients();

    if (!coefficients) {
        return;
    }

    const { a, b, c } = coefficients;

    // Calcul du discriminant
    const delta = cleanNumber(
        b * b - 4 * a * c
    );

    let resultHTML = "";
    let stepsHTML = "";


    /* =====================================
       ÉTAPE 1 : IDENTIFICATION
       ===================================== */

    stepsHTML += `
        <div class="step">

            <h3>Étape 1 — Identifier les coefficients</h3>

            <div class="math-line">
                a = ${formatNumber(a)}
            </div>

            <div class="math-line">
                b = ${formatNumber(b)}
            </div>

            <div class="math-line">
                c = ${formatNumber(c)}
            </div>

        </div>
    `;


    /* =====================================
       ÉTAPE 2 : DISCRIMINANT
       ===================================== */

    stepsHTML += `
        <div class="step">

            <h3>Étape 2 — Calculer le discriminant</h3>

            <div class="math-line">
                Δ = b² − 4ac
            </div>

            <div class="math-line">
                Δ = ${squareValue(b)}
                − 4 × ${formatNumber(a)}
                × ${formatNumber(c)}
            </div>

            <div class="math-line math-result">
                Δ = ${formatNumber(delta)}
            </div>

        </div>
    `;


    /* =====================================
       CAS Δ > 0
       ===================================== */

    if (delta > 0) {

        const sqrtDelta = Math.sqrt(delta);

        const x1 = cleanNumber(
            (-b - sqrtDelta) / (2 * a)
        );

        const x2 = cleanNumber(
            (-b + sqrtDelta) / (2 * a)
        );

        const rootExact = simplifySquareRoot(delta);

        let exactX1;
        let exactX2;

        /*
         * Si le discriminant est un carré parfait,
         * les solutions sont entièrement numériques.
         */
        if (Number.isInteger(Math.sqrt(delta))) {

            exactX1 =
                `(${formatNumber(-b)} − ${rootExact}) / ${formatNumber(2 * a)}`;

            exactX2 =
                `(${formatNumber(-b)} + ${rootExact}) / ${formatNumber(2 * a)}`;

        } else {

            exactX1 =
                `(${formatNumber(-b)} − ${rootExact}) / ${formatNumber(2 * a)}`;

            exactX2 =
                `(${formatNumber(-b)} + ${rootExact}) / ${formatNumber(2 * a)}`;
        }


        resultHTML = `
            <div class="result-summary positive">

                <h3>Δ &gt; 0 : deux solutions réelles</h3>

                <p>
                    L'équation possède deux solutions réelles distinctes.
                </p>

            </div>

            <div class="discriminant">
                Δ = ${formatNumber(delta)}
            </div>

            <div class="solutions">

                <div class="solution">

                    <h4>Solution x₁</h4>

                    <div class="exact">
                        x₁ = ${exactX1}
                    </div>

                    <div class="decimal">
                        Valeur décimale :
                        <strong>${formatNumber(x1)}</strong>
                    </div>

                </div>

                <div class="solution">

                    <h4>Solution x₂</h4>

                    <div class="exact">
                        x₂ = ${exactX2}
                    </div>

                    <div class="decimal">
                        Valeur décimale :
                        <strong>${formatNumber(x2)}</strong>
                    </div>

                </div>

            </div>
        `;


        stepsHTML += `
            <div class="step">

                <h3>Étape 3 — Déterminer les solutions</h3>

                <p>
                    Comme Δ &gt; 0, il existe deux solutions réelles :
                </p>

                <div class="math-line">
                    x₁ = (−b − √Δ) / 2a
                </div>

                <div class="math-line">
                    x₁ =
                    (${
                        formatNumber(-b)
                    } − √${
                        formatNumber(delta)
                    })
                    /
                    ${
                        formatNumber(2 * a)
                    }
                </div>

                <div class="math-line math-result">
                    x₁ = ${exactX1}
                </div>

                <div class="math-line">
                    x₁ ≈ ${formatNumber(x1)}
                </div>

                <br>

                <div class="math-line">
                    x₂ = (−b + √Δ) / 2a
                </div>

                <div class="math-line">
                    x₂ =
                    (${
                        formatNumber(-b)
                    } + √${
                        formatNumber(delta)
                    })
                    /
                    ${
                        formatNumber(2 * a)
                    }
                </div>

                <div class="math-line math-result">
                    x₂ = ${exactX2}
                </div>

                <div class="math-line">
                    x₂ ≈ ${formatNumber(x2)}
                </div>

            </div>
        `;
    }


    /* =====================================
       CAS Δ = 0
       ===================================== */

    else if (delta === 0) {

        const x0 = cleanNumber(
            -b / (2 * a)
        );

        const exactX0 =
            `−(${formatNumber(b)}) / (2 × ${formatNumber(a)})`;

        resultHTML = `
            <div class="result-summary zero">

                <h3>Δ = 0 : une solution réelle</h3>

                <p>
                    L'équation possède une solution réelle unique.
                </p>

            </div>

            <div class="discriminant">
                Δ = 0
            </div>

            <div class="solutions">

                <div class="solution">

                    <h4>Solution unique x₀</h4>

                    <div class="exact">
                        x₀ = ${exactX0}
                    </div>

                    <div class="decimal">
                        Valeur décimale :
                        <strong>${formatNumber(x0)}</strong>
                    </div>

                </div>

            </div>
        `;


        stepsHTML += `
            <div class="step">

                <h3>Étape 3 — Déterminer la solution</h3>

                <p>
                    Comme Δ = 0, l'équation possède une solution réelle unique.
                </p>

                <div class="math-line">
                    x₀ = −b / 2a
                </div>

                <div class="math-line">
                    x₀ =
                    −(${formatNumber(b)})
                    /
                    (2 × ${formatNumber(a)})
                </div>

                <div class="math-line math-result">
                    x₀ = ${exactX0}
                </div>

                <div class="math-line">
                    x₀ = ${formatNumber(x0)}
                </div>

            </div>
        `;
    }


    /* =====================================
       CAS Δ < 0
       ===================================== */

    else {

        const absoluteDelta = Math.abs(delta);

        const sqrtAbsDelta = Math.sqrt(
            absoluteDelta
        );

        const realPart = cleanNumber(
            -b / (2 * a)
        );

        const imaginaryPart = cleanNumber(
            sqrtAbsDelta / Math.abs(2 * a)
        );

        const rootExact =
            simplifySquareRoot(absoluteDelta);

        const denominator = 2 * a;

        /*
         * Forme générale :
         *
         * x = (-b ± i√|Δ|) / 2a
         *
         * On affiche également la forme
         * décimale complexe.
         */

        const complexX1 =
            `${formatNumber(realPart)} − ${formatNumber(imaginaryPart)}i`;

        const complexX2 =
            `${formatNumber(realPart)} + ${formatNumber(imaginaryPart)}i`;

        resultHTML = `
            <div class="result-summary negative">

                <h3>Δ &lt; 0 : aucune solution réelle</h3>

                <p>
                    L'équation ne possède aucune solution dans ℝ.
                    Elle possède cependant deux solutions complexes.
                </p>

            </div>

            <div class="discriminant">
                Δ = ${formatNumber(delta)}
            </div>

            <div class="solutions">

                <div class="solution">

                    <h4>Solution complexe x₁</h4>

                    <div class="exact">
                        x₁ =
                        (${
                            formatNumber(-b)
                        } − i√${
                            formatNumber(absoluteDelta)
                        })
                        /
                        ${formatNumber(denominator)}
                    </div>

                    <div class="decimal">
                        x₁ ≈ ${complexX1}
                    </div>

                </div>

                <div class="solution">

                    <h4>Solution complexe x₂</h4>

                    <div class="exact">
                        x₂ =
                        (${
                            formatNumber(-b)
                        } + i√${
                            formatNumber(absoluteDelta)
                        })
                        /
                        ${formatNumber(denominator)}
                    </div>

                    <div class="decimal">
                        x₂ ≈ ${complexX2}
                    </div>

                </div>

            </div>
        `;


        stepsHTML += `
            <div class="step">

                <h3>Étape 3 — Déterminer les solutions</h3>

                <p>
                    Comme Δ &lt; 0, il n'existe aucune solution réelle.
                    Nous utilisons les nombres complexes.
                </p>

                <div class="math-line">
                    √Δ = i√|Δ|
                </div>

                <div class="math-line">
                    |Δ| = ${formatNumber(absoluteDelta)}
                </div>

                <div class="math-line">
                    √|Δ| = ${rootExact}
                </div>

                <div class="math-line">
                    x₁ =
                    (${formatNumber(-b)} − i√${formatNumber(absoluteDelta)})
                    /
                    ${formatNumber(denominator)}
                </div>

                <div class="math-line math-result">
                    x₁ ≈ ${complexX1}
                </div>

                <div class="math-line">
                    x₂ =
                    (${formatNumber(-b)} + i√${formatNumber(absoluteDelta)})
                    /
                    ${formatNumber(denominator)}
                </div>

                <div class="math-line math-result">
                    x₂ ≈ ${complexX2}
                </div>

            </div>
        `;
    }


    /* =====================================
       AFFICHAGE
       ===================================== */

    resultContent.innerHTML = resultHTML;
    stepsContent.innerHTML = stepsHTML;

    resultSection.classList.remove("hidden");
    stepsSection.classList.remove("hidden");

    // Relance l'animation
    resultSection.classList.remove("show");
    stepsSection.classList.remove("show");

    void resultSection.offsetWidth;

    resultSection.classList.add("show");
    stepsSection.classList.add("show");

    // Faire défiler vers les résultats
    setTimeout(() => {

        resultSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }, 100);
}


/* =========================================
   RÉINITIALISATION
   ========================================= */

function resetCalculator() {

    inputA.value = "";
    inputB.value = "";
    inputC.value = "";

    errorMessage.textContent = "";
    errorMessage.style.display = "none";

    resultContent.innerHTML = "";
    stepsContent.innerHTML = "";

    resultSection.classList.add("hidden");
    stepsSection.classList.add("hidden");

    updatePreview();

    inputA.focus();
}


/* =========================================
   EXEMPLES
   ========================================= */

examples.forEach(example => {

    example.addEventListener("click", () => {

        inputA.value = example.dataset.a;
        inputB.value = example.dataset.b;
        inputC.value = example.dataset.c;

        updatePreview();

        errorMessage.textContent = "";
        errorMessage.style.display = "none";

        solveEquation();
    });

});


/* =========================================
   ÉVÉNEMENTS
   ========================================= */

solveBtn.addEventListener(
    "click",
    solveEquation
);

resetBtn.addEventListener(
    "click",
    resetCalculator
);


/*
 * Permet de résoudre avec la touche Entrée
 * lorsque l'utilisateur est dans un champ.
 */
[inputA, inputB, inputC].forEach(input => {

    input.addEventListener("keydown", event => {

        if (event.key === "Enter") {
            solveEquation();
        }

    });

});


/* =========================================
   INITIALISATION
   ========================================= */

updatePreview();
