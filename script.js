document.addEventListener('DOMContentLoaded', () => {
    // --- SELECTORES DOM ---
    const startButton = document.getElementById('start-button');
    const quizContainer = document.getElementById('quiz-container');
    const questionArea = document.getElementById('question-area');
    const questionTextElement = document.getElementById('question-text');
    const answerButtonsElement = document.getElementById('answer-buttons');
    
    const resultContainer = document.getElementById('result-container');
    const resultTitleElement = resultContainer.querySelector('h2'); 
    const resultHouseCrestElement = document.getElementById('result-house-crest');
    const resultHouseDescriptionElement = document.getElementById('result-house-description');
    const restartButton = document.getElementById('restart-button');

    const languageToggleButton = document.getElementById('language-toggle');
    const themeToggleButton = document.getElementById('theme-toggle');
    const themeIcon = themeToggleButton.querySelector('i');
    const langIndicator = document.getElementById('lang-indicator');
    const timeDisplay = document.getElementById('time-display');

    // --- ESTADO DE LA APLICACIÓN ---
    let currentQuestionIndex;
    let scores;
    let currentLanguage = localStorage.getItem('preferredLanguage') || 'es';
    let currentTheme = localStorage.getItem('preferredTheme') || 'dark';

    // --- TRADUCCIONES ---
    const translations = {
        es: {
            pageTitle: "Descrubre tu casa de Howgarts",
            mainHeading: "El Sombrero Seleccionador",
            subHeading: "Descubre a qué casa de Hogwarts perteneces.",
            loadingQuestion: "Cargando pregunta...",
            startButton: "Comenzar el Test",
            resultPrefix: "¡Eres de", 
            restartButton: "Hacer el test de nuevo",
            footerText: "© 2025 creado por Franco Zvilling",
            
            q1_question: "¿Qué cualidad valoras más en un amigo?",
            q1_ans1: "Valentía y coraje", q1_ans2: "Ambición y astucia", q1_ans3: "Lealtad y trabajo duro", q1_ans4: "Inteligencia y creatividad",
            q2_question: "Si pudieras tener una mascota mágica, ¿cuál elegirías?",
            q2_ans1: "Un Fénix majestuoso", q2_ans2: "Una serpiente astuta", q2_ans3: "Un Tejón amigable", q2_ans4: "Un Búho sabio",
            q3_question: "Te enfrentas a un Boggart. ¿En qué temes que se transforme?",
            q3_ans1: "Ver fracasar a tus seres queridos", q3_ans2: "Perder tu estatus o poder", q3_ans3: "Quedarte solo y sin amigos", q3_ans4: "Ser considerado ignorante",
            q4_question: "Encuentras una cartera perdida llena de dinero. ¿Qué haces?",
            q4_ans1: "Intentar encontrar al dueño, ¡es lo correcto!", q4_ans2: "Considerar quedármela si nadie me ve", q4_ans3: "Llevarla a objetos perdidos, sin dudarlo", q4_ans4: "Analizar la situación y buscar pistas para devolverla eficientemente",
            q5_question: "¿Qué tipo de hechizo te gustaría dominar?",
            q5_ans1: "Hechizos de duelo y protección", q5_ans2: "Hechizos sutiles para influenciar a otros", q5_ans3: "Hechizos curativos y de utilidad doméstica", q5_ans4: "Encantamientos complejos y poco conocidos",
            q6_question: "Si pudieras elegir una reliquia de la Muerte, ¿cuál sería?",
            q6_ans1: "La Espada de Gryffindor", q6_ans2: "La Varita de Saúco", q6_ans3: "La Piedra de la Resurrección", q6_ans4: "La Capa de Invisibilidad",
            q7_question: "Un troll ha entrado en las mazmorras. ¿Cuál es tu reacción inmediata?",
            q7_ans1: "Correr hacia el peligro para ayudar.", q7_ans2: "Buscar una ventaja estratégica o una ruta de escape segura.", q7_ans3: "Asegurarme de que mis amigos estén a salvo y buscar un profesor.", q7_ans4: "Recordar las debilidades de los trolls para idear un plan.",
            q8_question: "¿Qué asignatura de Hogwarts te atrae más?",
            q8_ans1: "Defensa Contra las Artes Oscuras", q8_ans2: "Pociones", q8_ans3: "Herbología", q8_ans4: "Encantamientos o Runas Antiguas",
            q9_question: "En una discusión grupal, tiendes a...",
            q9_ans1: "Defender tus ideas con pasión, incluso si es impopular.", q9_ans2: "Observar, analizar y luego persuadir a los demás a tu punto de vista.", q9_ans3: "Buscar el consenso y asegurarte de que todos se sientan escuchados.", q9_ans4: "Aportar datos, lógica y soluciones bien pensadas.",
            q10_question: "El Sombrero Seleccionador duda sobre ti. ¿Qué argumento le darías?",
            q10_ans1: "Que mi corazón es valiente y siempre busco hacer lo correcto.", q10_ans2: "Que tengo grandes aspiraciones y la determinación para alcanzarlas.", q10_ans3: "Que valoro la amistad y la justicia por encima de todo.", q10_ans4: "Que mi sed de conocimiento y mi mente abierta son mis mayores fortalezas.",
            
            gryffindorDescription: "Valoras el coraje, la osadía, el temple y la caballerosidad. ¡Bienvenido a la casa de los valientes!",
            slytherinDescription: "Eres astuto, ambicioso y ingenioso. Sabes lo que quieres y cómo conseguirlo. ¡La grandeza te espera!",
            hufflepuffDescription: "La lealtad, el trabajo duro, la paciencia y la justicia son tus estandartes. ¡Eres un amigo fiel y un gran compañero!",
            ravenclawDescription: "La inteligencia, el aprendizaje, la sabiduría y la creatividad te definen. ¡Tu mente es tu mayor tesoro!",
        },
        en: {
            pageTitle: "Discover your Hogwarts house",
            mainHeading: "The Sorting Hat",
            subHeading: "Discover which Hogwarts house you belong to.",
            loadingQuestion: "Loading question...",
            startButton: "Start Quiz",
            resultPrefix: "You belong to", 
            restartButton: "Take the quiz again",
            footerText: "© 2025 created by Franco Zvilling",

            q1_question: "Which quality do you value most in a friend?",
            q1_ans1: "Bravery and courage", q1_ans2: "Ambition and cunning", q1_ans3: "Loyalty and hard work", q1_ans4: "Intelligence and creativity",
            q2_question: "If you could have a magical pet, which would you choose?",
            q2_ans1: "A majestic Phoenix", q2_ans2: "A cunning snake", q2_ans3: "A friendly Badger", q2_ans4: "A wise Owl",
            q3_question: "You face a Boggart. What do you fear it will transform into?",
            q3_ans1: "Seeing your loved ones fail", q3_ans2: "Losing your status or power", q3_ans3: "Being left alone and friendless", q3_ans4: "Being considered ignorant",
            q4_question: "You find a lost wallet full of money. What do you do?",
            q4_ans1: "Try to find the owner, it's the right thing to do!", q4_ans2: "Consider keeping it if no one sees me", q4_ans3: "Take it to lost and found, without hesitation", q4_ans4: "Analyze the situation and look for clues to return it efficiently",
            q5_question: "What kind of spell would you like to master?",
            q5_ans1: "Dueling and protection spells", q5_ans2: "Subtle spells to influence others", q5_ans3: "Healing and household utility spells", q5_ans4: "Complex and little-known enchantments",
            q6_question: "If you could choose one Deathly Hallow, which would it be?",
            q6_ans1: "The Sword of Gryffindor", q6_ans2: "The Elder Wand", q6_ans3: "The Resurrection Stone", q6_ans4: "The Invisibility Cloak",
            q7_question: "A troll has entered the dungeons. What is your immediate reaction?",
            q7_ans1: "Run towards the danger to help.", q7_ans2: "Look for a strategic advantage or a safe escape route.", q7_ans3: "Make sure my friends are safe and find a professor.", q7_ans4: "Recall the weaknesses of trolls to devise a plan.",
            q8_question: "Which Hogwarts subject appeals to you most?",
            q8_ans1: "Defence Against the Dark Arts", q8_ans2: "Potions", q8_ans3: "Herbology", q8_ans4: "Charms or Ancient Runes",
            q9_question: "In a group discussion, you tend to...",
            q9_ans1: "Defend your ideas passionately, even if unpopular.", q9_ans2: "Observe, analyze, and then persuade others to your point of view.", q9_ans3: "Seek consensus and ensure everyone feels heard.", q9_ans4: "Provide data, logic, and well-thought-out solutions.",
            q10_question: "The Sorting Hat is unsure about you. What argument would you give it?",
            q10_ans1: "That my heart is brave and I always seek to do what is right.", q10_ans2: "That I have great aspirations and the determination to achieve them.", q10_ans3: "That I value friendship and justice above all else.", q10_ans4: "That my thirst for knowledge and my open mind are my greatest strengths.",

            gryffindorDescription: "You value courage, daring, nerve, and chivalry. Welcome to the house of the brave!",
            slytherinDescription: "You are cunning, ambitious, and resourceful. You know what you want and how to get it. Greatness awaits you!",
            hufflepuffDescription: "Loyalty, hard work, patience, and justice are your banners. You are a faithful friend and a great companion!",
            ravenclawDescription: "Intelligence, learning, wisdom, and creativity define you. Your mind is your greatest treasure!",
        }
    };

    const baseQuestions = [
        { id: "q1", answers: [ { textKey: "q1_ans1", house: "Gryffindor" }, { textKey: "q1_ans2", house: "Slytherin" }, { textKey: "q1_ans3", house: "Hufflepuff" }, { textKey: "q1_ans4", house: "Ravenclaw" }] },
        { id: "q2", answers: [ { textKey: "q2_ans1", house: "Gryffindor" }, { textKey: "q2_ans2", house: "Slytherin" }, { textKey: "q2_ans3", house: "Hufflepuff" }, { textKey: "q2_ans4", house: "Ravenclaw" }] },
        { id: "q3", answers: [ { textKey: "q3_ans1", house: "Gryffindor" }, { textKey: "q3_ans2", house: "Slytherin" }, { textKey: "q3_ans3", house: "Hufflepuff" }, { textKey: "q3_ans4", house: "Ravenclaw" }] },
        { id: "q4", answers: [ { textKey: "q4_ans1", house: "Gryffindor" }, { textKey: "q4_ans2", house: "Slytherin" }, { textKey: "q4_ans3", house: "Hufflepuff" }, { textKey: "q4_ans4", house: "Ravenclaw" }] },
        { id: "q5", answers: [ { textKey: "q5_ans1", house: "Gryffindor" }, { textKey: "q5_ans2", house: "Slytherin" }, { textKey: "q5_ans3", house: "Hufflepuff" }, { textKey: "q5_ans4", house: "Ravenclaw" }] },
        { id: "q6", answers: [ { textKey: "q6_ans1", house: "Gryffindor" }, { textKey: "q6_ans2", house: "Slytherin" }, { textKey: "q6_ans3", house: "Hufflepuff" }, { textKey: "q6_ans4", house: "Ravenclaw" }] },
        { id: "q7", answers: [ { textKey: "q7_ans1", house: "Gryffindor" }, { textKey: "q7_ans2", house: "Slytherin" }, { textKey: "q7_ans3", house: "Hufflepuff" }, { textKey: "q7_ans4", house: "Ravenclaw" }] },
        { id: "q8", answers: [ { textKey: "q8_ans1", house: "Gryffindor" }, { textKey: "q8_ans2", house: "Slytherin" }, { textKey: "q8_ans3", house: "Hufflepuff" }, { textKey: "q8_ans4", house: "Ravenclaw" }] },
        { id: "q9", answers: [ { textKey: "q9_ans1", house: "Gryffindor" }, { textKey: "q9_ans2", house: "Slytherin" }, { textKey: "q9_ans3", house: "Hufflepuff" }, { textKey: "q9_ans4", house: "Ravenclaw" }] },
        { id: "q10", answers: [ { textKey: "q10_ans1", house: "Gryffindor" }, { textKey: "q10_ans2", house: "Slytherin" }, { textKey: "q10_ans3", house: "Hufflepuff" }, { textKey: "q10_ans4", house: "Ravenclaw" }] }
    ];

    const houseInfo = { 
        Gryffindor: { name: "Gryffindor", crest: "img/gryffindor.png", descriptionKey: "gryffindorDescription", themeClass: "gryffindor-theme" },
        Slytherin: { name: "Slytherin", crest: "img/slytherin.png", descriptionKey: "slytherinDescription", themeClass: "slytherin-theme" },
        Hufflepuff: { name: "Hufflepuff", crest: "img/hufflepuff.png", descriptionKey: "hufflepuffDescription", themeClass: "hufflepuff-theme" },
        Ravenclaw: { name: "Ravenclaw", crest: "img/ravenclaw.png", descriptionKey: "ravenclawDescription", themeClass: "ravenclaw-theme" }
    };

    // --- FUNCIONES DE LÓGICA ---

    function applyTranslations() {
        document.documentElement.lang = currentLanguage;
        const elementsToTranslate = document.querySelectorAll('[data-translate-key]');
        elementsToTranslate.forEach(el => {
            const key = el.dataset.translateKey;
            if (translations[currentLanguage] && translations[currentLanguage][key]) {
                el.innerHTML = translations[currentLanguage][key];
            }
        });
        if (!resultContainer.classList.contains('hidden')) {
            const lastResultHouse = resultContainer.dataset.lastHouse;
            if (lastResultHouse) {
                const houseData = houseInfo[lastResultHouse];
                const prefix = translations[currentLanguage].resultPrefix || (currentLanguage === 'es' ? "¡Eres de" : "You belong to");
                const houseDisplayName = houseData.name; 
                resultTitleElement.innerHTML = `${prefix} ${houseDisplayName}!`;
                resultHouseDescriptionElement.textContent = translations[currentLanguage][houseData.descriptionKey] || "Description missing";
            }
        }
    }

    function toggleLanguage() {
        currentLanguage = currentLanguage === 'es' ? 'en' : 'es';
        localStorage.setItem('preferredLanguage', currentLanguage);
        langIndicator.textContent = currentLanguage.toUpperCase();
        applyTranslations(); 
        if (currentQuestionIndex !== undefined && currentQuestionIndex < baseQuestions.length && !questionArea.classList.contains('hidden')) {
            resetState(); 
            showQuestion(baseQuestions[currentQuestionIndex]); 
        }
    }

    function applyTheme() {
        document.body.classList.toggle('light-mode', currentTheme === 'light');
        themeIcon.classList.toggle('fa-sun', currentTheme === 'dark');
        themeIcon.classList.toggle('fa-moon', currentTheme === 'light');
        localStorage.setItem('preferredTheme', currentTheme);
    }

    function toggleTheme() {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme();
    }
    
    function updateTime() {
        const now = new Date();
        timeDisplay.textContent = now.toLocaleTimeString(currentLanguage === 'en' ? 'en-US' : 'es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }

    function startQuiz() {
        scores = { Gryffindor: 0, Slytherin: 0, Hufflepuff: 0, Ravenclaw: 0 };
        currentQuestionIndex = 0;
        quizContainer.classList.remove('hidden');
        questionArea.classList.remove('hidden');
        startButton.classList.add('hidden');
        resultContainer.classList.add('hidden');
        Object.values(houseInfo).forEach(info => resultContainer.classList.remove(info.themeClass));
        // Limpiar confeti viejo si existe
        const oldConfetti = resultContainer.querySelectorAll('.confetti-piece');
        oldConfetti.forEach(c => c.remove());
        setNextQuestion();
    }

    function setNextQuestion() {
        resetState();
        if (currentQuestionIndex < baseQuestions.length) {
            showQuestion(baseQuestions[currentQuestionIndex]);
        } else {
            const finalHouse = determineHouse();
            showResult(finalHouse);
        }
    }

    function showQuestion(questionData) {
        questionTextElement.textContent = translations[currentLanguage][questionData.id + "_question"] || "Question text missing";
        
        questionData.answers.forEach(answer => {
            const button = document.createElement('button');
            button.innerText = translations[currentLanguage][answer.textKey] || "Answer text missing";
            button.classList.add('btn');
            button.addEventListener('click', () => selectAnswer(answer.house));
            answerButtonsElement.appendChild(button);
        });
    }

    function resetState() {
        while (answerButtonsElement.firstChild) {
            answerButtonsElement.removeChild(answerButtonsElement.firstChild);
        }
    }

    function selectAnswer(house) {
        scores[house]++;
        currentQuestionIndex++;
        setNextQuestion();
    }

    function determineHouse() {
        let maxScore = -1;
        let determinedHouse = "";
        for (const house in scores) {
            if (scores[house] > maxScore) {
                maxScore = scores[house];
                determinedHouse = house;
            }
        }
        const tiedHouses = Object.keys(scores).filter(house => scores[house] === maxScore);
        if (tiedHouses.length > 1) {
            determinedHouse = tiedHouses[Math.floor(Math.random() * tiedHouses.length)];
        }
        return determinedHouse;
    }

    function createConfetti(houseKey) {
        const confettiColors = {
            Gryffindor: [getComputedStyle(document.documentElement).getPropertyValue('--confetti-gryffindor1').trim(), getComputedStyle(document.documentElement).getPropertyValue('--confetti-gryffindor2').trim()],
            Slytherin: [getComputedStyle(document.documentElement).getPropertyValue('--confetti-slytherin1').trim(), getComputedStyle(document.documentElement).getPropertyValue('--confetti-slytherin2').trim()],
            Hufflepuff: [getComputedStyle(document.documentElement).getPropertyValue('--confetti-hufflepuff1').trim(), getComputedStyle(document.documentElement).getPropertyValue('--confetti-hufflepuff2').trim()],
            Ravenclaw: [getComputedStyle(document.documentElement).getPropertyValue('--confetti-ravenclaw1').trim(), getComputedStyle(document.documentElement).getPropertyValue('--confetti-ravenclaw2').trim()]
        };

        const colors = confettiColors[houseKey] || ['#FFD700', '#FF69B4']; // Fallback: dorado y rosa
        const confettiCount = 120; 
        const fragment = document.createDocumentFragment();

        const crestRect = resultHouseCrestElement.getBoundingClientRect();
        const containerRect = resultContainer.getBoundingClientRect();
        const originX = crestRect.left + (crestRect.width / 2) - containerRect.left;
        const originY = crestRect.top + (crestRect.height / 3) - containerRect.top; // Origen un poco más arriba del centro del escudo

        for (let i = 0; i < confettiCount; i++) {
            const piece = document.createElement('div');
            piece.classList.add('confetti-piece');

            piece.style.left = `${originX}px`;
            piece.style.top = `${originY}px`;
            piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            piece.style.setProperty('--random-x', (Math.random() - 0.5) * 2.5); // Aumentar dispersión X
            piece.style.setProperty('--random-rotZ', (Math.random() - 0.5) * 2.5); 
            piece.style.setProperty('--random-rotX', (Math.random() - 0.5) * 2.5);

            const duration = Math.random() * 1.8 + 1.2; // Duración entre 1.2s y 3s
            const delay = Math.random() * 0.4;       

            piece.style.animation = `confetti-fall ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s forwards`;
            
            piece.onanimationend = () => {
                piece.remove();
            };
            fragment.appendChild(piece);
        }
        resultContainer.appendChild(fragment);
    }

    function showResult(houseKey) {
        quizContainer.classList.add('hidden');
        questionArea.classList.add('hidden');
        
        const houseData = houseInfo[houseKey];
        const prefix = translations[currentLanguage].resultPrefix || (currentLanguage === 'es' ? "¡Eres de" : "You belong to");
        const houseDisplayName = houseData.name; 

        resultTitleElement.innerHTML = `${prefix} ${houseDisplayName}!`;
        
        resultHouseCrestElement.src = houseData.crest;
        const pageTitleKey = document.querySelector('title').dataset.translateKey;
        const pageTitleText = translations[currentLanguage][pageTitleKey] || "Sorting Hat";
        resultHouseCrestElement.alt = `${pageTitleText} - ${houseDisplayName}`; 
        
        resultHouseDescriptionElement.textContent = translations[currentLanguage][houseData.descriptionKey] || "Description missing";
        
        Object.values(houseInfo).forEach(info => resultContainer.classList.remove(info.themeClass));
        resultContainer.classList.add(houseData.themeClass);
        resultContainer.classList.remove('hidden');
        resultContainer.dataset.lastHouse = houseKey;

        resultHouseCrestElement.style.animation = 'none';
        resultHouseCrestElement.offsetHeight; 
        resultHouseCrestElement.style.animation = null; 

        setTimeout(() => {
            createConfetti(houseKey);
        }, 250); // Ajusta el delay para que coincida con la aparición del resultado
    }

    // --- INICIALIZACIÓN ---
    startButton.addEventListener('click', startQuiz);
    restartButton.addEventListener('click', startQuiz);
    languageToggleButton.addEventListener('click', toggleLanguage);
    themeToggleButton.addEventListener('click', toggleTheme);

    questionArea.classList.add('hidden');
    resultContainer.classList.add('hidden');
    
    applyTheme();
    langIndicator.textContent = currentLanguage.toUpperCase();
    applyTranslations(); 
    
    updateTime();
    setInterval(updateTime, 1000);
});