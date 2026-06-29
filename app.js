/* ==========================================
   Tuteur de Mathématiques - Logique de l'application
   ========================================== */

// État global de l'application
const state = {
    lessons: [],
    exercises: [],
    themes: [], // Utiliser un tableau au lieu d'un Set pour un ordre stable
    currentTheme: null,
    currentExerciseIndex: 0,
    currentState: 'home', // home, lesson, practice
    themeExercises: [], // Exercices du thème courant (mélangés)
    revealed: {
        hint: false,
        demo: false,
        answer: false
    }
};

/**
 * Mélanger un tableau (algorithme Fisher-Yates)
 */
function shuffleArray(array) {
    const shuffled = [...array]; // Copier le tableau
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    console.log('Exercices mélangés pour le thème:', state.currentTheme, shuffled);
    return shuffled;
}

// Charger les données au démarrage
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Charger les fichiers JSON
        const lessonsResponse = await fetch('data/lecons.json');
        const exercisesResponse = await fetch('data/exercices.json');
        
        if (!lessonsResponse.ok || !exercisesResponse.ok) {
            throw new Error('Erreur lors du chargement des données');
        }
        
        state.lessons = await lessonsResponse.json();
        state.exercises = await exercisesResponse.json();
        
        // Extraire les thèmes uniques à partir des exercices et les trier
        const uniqueThemes = new Set();
        state.exercises.forEach(exercise => {
            uniqueThemes.add(exercise.theme);
        });
        state.themes = Array.from(uniqueThemes).sort();
        
        // Afficher l'écran d'accueil
        showHomeScreen();
        
        // Attacher les écouteurs d'événements
        setupEventListeners();
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors du chargement de l\'application. Vérifiez les fichiers JSON.');
    }
});

// ==========================================
// Écrans et navigation
// ==========================================

/**
 * Afficher l'écran d'accueil avec la liste des thèmes
 */
function showHomeScreen() {
    hideAllScreens();
    document.getElementById('homeScreen').classList.add('active');
    state.currentState = 'home';
    
    // Générer les cartes de thèmes
    const topicList = document.getElementById('topicList');
    topicList.innerHTML = '';
    
    state.themes.forEach(theme => {
        const card = document.createElement('div');
        card.className = 'topic-card';
        
        // Trouver la leçon correspondante pour le titre
        const lesson = state.lessons.find(l => l.theme === theme);
        const title = lesson ? lesson.titre : theme;
        
        card.innerHTML = `<h3>${title}</h3>`;
        card.addEventListener('click', () => selectTheme(theme));
        topicList.appendChild(card);
    });
}

/**
 * Sélectionner un thème et afficher la leçon (ou les exercices si pas de leçon)
 */
function selectTheme(theme) {
    state.currentTheme = theme;
    state.revealed = { hint: false, demo: false, answer: false };
    
    // Vérifier s'il existe une leçon pour ce thème
    const lesson = state.lessons.find(l => l.theme === theme);
    
    if (lesson) {
        // S'il y a une leçon, l'afficher
        showLessonScreen();
    } else {
        // S'il n'y a pas de leçon, aller directement aux exercices
        console.warn('Aucune leçon trouvée pour le thème:', theme, '- Passage direct aux exercices.');
        showPracticeScreen();
    }
}

/**
 * Afficher l'écran de leçon
 */
function showLessonScreen() {
    hideAllScreens();
    document.getElementById('lessonScreen').classList.add('active');
    state.currentState = 'lesson';
    
    const lesson = state.lessons.find(l => l.theme === state.currentTheme);
    
    if (!lesson) {
        console.error('Leçon non trouvée pour le thème:', state.currentTheme);
        alert('Erreur : Aucune leçon trouvée pour ce thème. Veuillez sélectionner un autre thème.');
        showHomeScreen();
        return;
    }
    
    // Remplir les éléments de la leçon
    document.getElementById('lessonTitle').textContent = lesson.titre;
    document.getElementById('lessonExplication').textContent = lesson.explication;
    
    // Afficher le vocabulaire
    const vocabList = document.getElementById('lessonVocabulaire');
    vocabList.innerHTML = '';
    lesson.vocabulaire.forEach(vocab => {
        const item = document.createElement('div');
        item.className = 'vocab-item';
        item.innerHTML = `
            <strong>${vocab.terme}</strong>
            <p>${vocab.definition}</p>
        `;
        vocabList.appendChild(item);
    });
    
    // Afficher l'exemple travaillé
    const example = lesson.exemple;
    document.getElementById('exampleEnonce').textContent = example.enonce;
    document.getElementById('exampleComprendre').textContent = example.comprendre;
    document.getElementById('exampleOrganiser').textContent = example.organiser;
    document.getElementById('exampleResoudre').textContent = example.resoudre;
    document.getElementById('exampleVerifier').textContent = example.verifier;
    document.getElementById('exampleReponse').textContent = example.reponse || lesson.reponse;
}

/**
 * Afficher l'écran de pratique
 */
function showPracticeScreen() {
    console.log('📝 Début de showPracticeScreen() pour le thème:', state.currentTheme);
    hideAllScreens();
    document.getElementById('practiceScreen').classList.add('active');
    state.currentState = 'practice';
    
    // Scroll vers le haut de la page
    window.scrollTo(0, 0);
    
    // Réinitialiser l'état de révélation
    state.revealed = { hint: false, demo: false, answer: false };
    state.currentExerciseIndex = 0;
    
    // Filtrer les exercices pour le thème courant et les mélanger
    const filteredExercises = state.exercises.filter(ex => ex.theme === state.currentTheme);
    console.log('Exercices trouvés avant mélange:', filteredExercises.length);
    state.themeExercises = shuffleArray(filteredExercises);
    console.log('Exercices après mélange:', state.themeExercises.map(ex => ex.id));
    
    if (state.themeExercises.length === 0) {
        alert('Aucun exercice trouvé pour ce thème.');
        showHomeScreen();
        return;
    }
    
    // Afficher le premier exercice
    displayExercise(state.themeExercises[state.currentExerciseIndex], 
                   state.currentExerciseIndex + 1, 
                   state.themeExercises.length);
}

/**
 * Afficher un exercice spécifique
 */
function displayExercise(exercise, index, total) {
    const lesson = state.lessons.find(l => l.theme === state.currentTheme);
    
    // Scroll vers le haut de la page
    window.scrollTo(0, 0);
    
    // Titre et compteur
    document.getElementById('practiceTitle').textContent = lesson ? lesson.titre : state.currentTheme;
    document.getElementById('exerciseCounter').textContent = `Exercice ${index} / ${total}`;
    
    // Énoncé
    document.getElementById('enonce').textContent = exercise.enonce;
    
    // Vocabulaire de l'exercice
    const vocabList = document.getElementById('vocabList');
    vocabList.innerHTML = '';
    if (exercise.vocabulaire && exercise.vocabulaire.length > 0) {
        exercise.vocabulaire.forEach(vocab => {
            const item = document.createElement('div');
            item.className = 'vocab-item-small';
            item.innerHTML = `
                <strong>${vocab.terme}</strong>
                <p>${vocab.sens}</p>
            `;
            vocabList.appendChild(item);
        });
    } else {
        vocabList.innerHTML = '<p style="color: #ccc;">Aucun vocabulaire spécifique pour cet exercice.</p>';
    }
    
    // Réinitialiser les boutons et conteneurs
    resetExerciseDisplay();
    
    // Afficher les options de réponse si disponibles
    if (exercise.options && exercise.options.length > 0) {
        displayMultipleChoice(exercise);
    }
}

/**
 * Réinitialiser l'affichage de l'exercice (masquer démarche, réponse, etc.)
 */
function resetExerciseDisplay() {
    // Masquer tous les conteneurs
    document.getElementById('comprendre').textContent = '';
    document.getElementById('organiser').textContent = '';
    document.getElementById('resoudre').textContent = '';
    document.getElementById('verifier').textContent = '';
    document.getElementById('reponseContainer').style.display = 'none';
    document.getElementById('reponse').textContent = '';
    document.getElementById('optionsContainer').style.display = 'none';
    document.getElementById('feedbackMessage').style.display = 'none';
    
    // Réinitialiser les boutons - Toujours afficher indice et démarche
    document.getElementById('hintButton').style.display = 'block';
    document.getElementById('hintButton').textContent = 'Voir un indice';
    document.getElementById('demoButton').style.display = 'block';
    document.getElementById('demoButton').textContent = 'Voir la démarche';
    document.getElementById('answerButton').style.display = 'none';
    document.getElementById('nextButton').style.display = 'none';
    
    state.revealed = { hint: false, demo: false, answer: false };
}

/**
 * Afficher et gérer les options de réponse (choix multiples)
 */
function displayMultipleChoice(exercise) {
    const optionsContainer = document.getElementById('optionsContainer');
    const optionsList = document.getElementById('optionsList');
    
    optionsList.innerHTML = '';
    optionsContainer.style.display = 'block';
    
    exercise.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-button';
        button.textContent = option;
        button.addEventListener('click', () => selectOption(index, exercise.correctOptionIndex));
        optionsList.appendChild(button);
    });
    
    // Masquer les boutons principaux jusqu'à la réponse
    document.getElementById('hintButton').style.display = 'none';
}

/**
 * Gérer la sélection d'une réponse multiple
 */
function selectOption(selectedIndex, correctIndex) {
    const optionButtons = document.querySelectorAll('.option-button');
    const feedbackMessage = document.getElementById('feedbackMessage');
    const isCorrect = selectedIndex === correctIndex;
    
    // Désactiver tous les boutons
    optionButtons.forEach(btn => {
        btn.style.pointerEvents = 'none';
        btn.disabled = true;
    });
    
    // Marquer le bouton sélectionné
    optionButtons[selectedIndex].classList.add('selected');
    
    // Mettre en évidence la réponse correcte
    optionButtons[correctIndex].classList.add('correct');
    
    // Si incorrect, marquer le bouton cliqué comme incorrect
    if (!isCorrect) {
        optionButtons[selectedIndex].classList.add('incorrect');
    }
    
    // Afficher le message de retour
    feedbackMessage.style.display = 'block';
    if (isCorrect) {
        feedbackMessage.className = 'feedback-message correct';
        feedbackMessage.textContent = '✓ Bonne réponse ! Bien joué !';
    } else {
        feedbackMessage.className = 'feedback-message incorrect';
        feedbackMessage.textContent = '✗ Mauvaise réponse. Essaie de voir la démarche ci-dessous.';
    }
    
    // Afficher les boutons d'aide (toujours disponibles)
    document.getElementById('hintButton').style.display = 'block';
    document.getElementById('demoButton').style.display = 'block';
    document.getElementById('demoButton').textContent = 'Voir la démarche';
}

/**
 * Masquer tous les écrans
 */
function hideAllScreens() {
    document.getElementById('homeScreen').classList.remove('active');
    document.getElementById('lessonScreen').classList.remove('active');
    document.getElementById('practiceScreen').classList.remove('active');
}

// ==========================================
// Actions sur les boutons et interactions
// ==========================================

/**
 * Configurer tous les écouteurs d'événements
 */
function setupEventListeners() {
    // Bouton retour depuis la leçon
    document.getElementById('backFromLesson').addEventListener('click', showHomeScreen);
    
    // Bouton retour depuis la pratique
    document.getElementById('backFromPractice').addEventListener('click', showHomeScreen);
    
    // Bouton "Commencer les exercices" depuis la leçon
    document.getElementById('startPractice').addEventListener('click', showPracticeScreen);
    
    // Bouton indice
    document.getElementById('hintButton').addEventListener('click', showHint);
    
    // Bouton démarche
    document.getElementById('demoButton').addEventListener('click', showDemo);
    
    // Bouton réponse
    document.getElementById('answerButton').addEventListener('click', showAnswer);
    
    // Bouton prochain exercice
    document.getElementById('nextButton').addEventListener('click', nextExercise);
}

/**
 * Afficher l'indice (toujours disponible)
 */
function showHint() {
    const exercise = state.themeExercises[state.currentExerciseIndex];
    alert('💡 Indice : ' + exercise.indice);
}

/**
 * Afficher/masquer la démarche complète (les quatre étapes) - Toggle
 */
function showDemo() {
    const exercise = state.themeExercises[state.currentExerciseIndex];
    const demoContainer = document.querySelector('.demarche-steps');
    const comprendre = document.getElementById('comprendre');
    const demoButton = document.getElementById('demoButton');
    
    // Toggle: if already revealed, hide it; otherwise show it
    if (state.revealed.demo) {
        // Masquer la démarche
        comprendre.textContent = '';
        document.getElementById('organiser').textContent = '';
        document.getElementById('resoudre').textContent = '';
        document.getElementById('verifier').textContent = '';
        state.revealed.demo = false;
        demoButton.textContent = 'Voir la démarche';
    } else {
        // Afficher la démarche
        document.getElementById('comprendre').textContent = exercise.demarche.comprendre;
        document.getElementById('organiser').textContent = exercise.demarche.organiser;
        document.getElementById('resoudre').textContent = exercise.demarche.resoudre;
        document.getElementById('verifier').textContent = exercise.demarche.verifier;
        state.revealed.demo = true;
        demoButton.textContent = 'Masquer la démarche';
    }
    
    // Show answer button after demarche is revealed
    if (state.revealed.demo && !state.revealed.answer) {
        document.getElementById('answerButton').style.display = 'block';
    }
}

/**
 * Afficher la réponse finale
 */
function showAnswer() {
    if (state.revealed.answer) return;
    
    const exercise = state.themeExercises[state.currentExerciseIndex];
    
    // Afficher le conteneur de réponse et la réponse
    document.getElementById('reponse').textContent = exercise.reponse;
    document.getElementById('reponseContainer').style.display = 'block';
    
    state.revealed.answer = true;
    
    // Changer le bouton pour "Prochain exercice"
    document.getElementById('answerButton').style.display = 'none';
    
    // Si c'est le dernier exercice, afficher "Retour", sinon "Prochain"
    const themeExercisesCount = state.themeExercises.length;
    if (state.currentExerciseIndex + 1 < themeExercisesCount) {
        document.getElementById('nextButton').textContent = 'Prochain exercice';
    } else {
        document.getElementById('nextButton').textContent = 'Retour';
    }
    
    document.getElementById('nextButton').style.display = 'block';
}

/**
 * Aller à l'exercice suivant ou revenir au home
 */
function nextExercise() {
    if (state.currentExerciseIndex + 1 < state.themeExercises.length) {
        // Il y a un prochain exercice
        state.currentExerciseIndex++;
        displayExercise(state.themeExercises[state.currentExerciseIndex], 
                       state.currentExerciseIndex + 1, 
                       state.themeExercises.length);
    } else {
        // C'était le dernier, retourner au home
        showHomeScreen();
    }
}
