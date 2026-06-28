/* ==========================================
   Tuteur de Mathématiques - Logique de l'application
   ========================================== */

// État global de l'application
const state = {
    lessons: [],
    exercises: [],
    themes: new Set(),
    currentTheme: null,
    currentExerciseIndex: 0,
    currentState: 'home', // home, lesson, practice
    revealed: {
        hint: false,
        demo: false,
        answer: false
    }
};

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
        
        // Extraire les thèmes uniques à partir des exercices disponibles
        state.exercises.forEach(exercise => {
            state.themes.add(exercise.theme);
        });
        
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
 * Sélectionner un thème et afficher la leçon
 */
function selectTheme(theme) {
    state.currentTheme = theme;
    state.revealed = { hint: false, demo: false, answer: false };
    showLessonScreen();
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
    hideAllScreens();
    document.getElementById('practiceScreen').classList.add('active');
    state.currentState = 'practice';
    
    // Réinitialiser l'état de révélation
    state.revealed = { hint: false, demo: false, answer: false };
    state.currentExerciseIndex = 0;
    
    // Filtrer les exercices pour le thème courant
    const themeExercises = state.exercises.filter(ex => ex.theme === state.currentTheme);
    
    if (themeExercises.length === 0) {
        alert('Aucun exercice trouvé pour ce thème.');
        showHomeScreen();
        return;
    }
    
    // Afficher le premier exercice
    displayExercise(themeExercises[state.currentExerciseIndex], 
                   state.currentExerciseIndex + 1, 
                   themeExercises.length);
}

/**
 * Afficher un exercice spécifique
 */
function displayExercise(exercise, index, total) {
    const themeExercises = state.exercises.filter(ex => ex.theme === state.currentTheme);
    const lesson = state.lessons.find(l => l.theme === state.currentTheme);
    
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
    
    // Réinitialiser les boutons
    document.getElementById('hintButton').style.display = 'block';
    document.getElementById('hintButton').textContent = 'Voir un indice';
    document.getElementById('demoButton').style.display = 'none';
    document.getElementById('answerButton').style.display = 'none';
    document.getElementById('nextButton').style.display = 'none';
    
    state.revealed = { hint: false, demo: false, answer: false };
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
 * Afficher l'indice (et montrer le bouton pour la démarche)
 */
function showHint() {
    if (state.revealed.hint) return;
    
    const themeExercises = state.exercises.filter(ex => ex.theme === state.currentTheme);
    const exercise = themeExercises[state.currentExerciseIndex];
    
    // Afficher l'indice (simple alerte ou intégré)
    alert('💡 Indice : ' + exercise.indice);
    
    state.revealed.hint = true;
    
    // Changer le bouton pour "Voir la démarche"
    document.getElementById('hintButton').style.display = 'none';
    document.getElementById('demoButton').style.display = 'block';
}

/**
 * Afficher la démarche complète (les quatre étapes)
 */
function showDemo() {
    if (state.revealed.demo) return;
    
    const themeExercises = state.exercises.filter(ex => ex.theme === state.currentTheme);
    const exercise = themeExercises[state.currentExerciseIndex];
    
    // Remplir les quatre étapes
    document.getElementById('comprendre').textContent = exercise.demarche.comprendre;
    document.getElementById('organiser').textContent = exercise.demarche.organiser;
    document.getElementById('resoudre').textContent = exercise.demarche.resoudre;
    document.getElementById('verifier').textContent = exercise.demarche.verifier;
    
    state.revealed.demo = true;
    
    // Changer le bouton pour "Voir la réponse"
    document.getElementById('demoButton').style.display = 'none';
    document.getElementById('answerButton').style.display = 'block';
}

/**
 * Afficher la réponse finale
 */
function showAnswer() {
    if (state.revealed.answer) return;
    
    const themeExercises = state.exercises.filter(ex => ex.theme === state.currentTheme);
    const exercise = themeExercises[state.currentExerciseIndex];
    
    // Afficher le conteneur de réponse et la réponse
    document.getElementById('reponse').textContent = exercise.reponse;
    document.getElementById('reponseContainer').style.display = 'block';
    
    state.revealed.answer = true;
    
    // Changer le bouton pour "Prochain exercice"
    document.getElementById('answerButton').style.display = 'none';
    
    // Si c'est le dernier exercice, afficher "Retour", sinon "Prochain"
    const themeExercisesCount = themeExercises.length;
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
    const themeExercises = state.exercises.filter(ex => ex.theme === state.currentTheme);
    
    if (state.currentExerciseIndex + 1 < themeExercises.length) {
        // Il y a un prochain exercice
        state.currentExerciseIndex++;
        displayExercise(themeExercises[state.currentExerciseIndex], 
                       state.currentExerciseIndex + 1, 
                       themeExercises.length);
    } else {
        // C'était le dernier, retourner au home
        showHomeScreen();
    }
}
