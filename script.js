// --- START OF script.js ---
// Note: Assumes topics.js has already been loaded and executed,
// making topicsData and the initial #content HTML available.

let quizState = {
    currentQuestionIndex: 0,
    correctAnswers: 0,
    totalQuestions: 0,
    startTime: null,
    endTime: null,
    selectedAnswers: [],
    questions: [],
    originalQuestions: [], // Keep original order for redo
    subject: '',
    unit: '',
    lesson: '',
    semester: '',
    matchingState: {
        selectedPromptElement: null,
        selectedMatchElement: null,
        userPairs: {} // Stores { promptIndex: matchIndex }
        // sortableInstances: [] // If using Drag-and-Drop
    }
};
let allLessonStats = {}; // { lessonKey: { bestScore, totalQuestions, bestTime } }
let subjectTotalQuestions = {}; // { subjectName: totalQuestionCount } <- Populated by calculateSubjectTotals

// --- Constants ---
const LS_THEME_KEY = 'quizAppTheme';
const LS_VISITED_KEY = 'quizAppVisited';
const LS_STATS_KEY = 'quizAppLessonStats';
const RTL_SUBJECTS = ["اللغة العربية", "دين", "التاريخ"];
const STATS_SUBJECT_ORDER = ["التاريخ", "دين", "اللغة العربية", "english"];

// --- UI String Translations ---
const uiStrings = {
    en: {
        firstSemester: "First Semester", secondSemester: "Second Semester",
        backToTopics: "Back to Topics", submit: "Submit", next: "Next Question",
        viewResults: "View Results",
        resultsSubjectLabel: "Subject:", resultsSemesterLabel: "Semester:",
        resultsUnitLabel: "Unit:", resultsLessonLabel: "Lesson:", resultsCorrectLabel: "Correct:",
        resultsTimeLabel: "Time:", resultsYourAnswerLabel: "Your Answer:", resultsCorrectAnswerLabel: "Correct Answer:",
        redoQuiz: "Redo Quiz", reviewAnswers: "Review Answers",
        backToResults: "Back to Results",
        settingsTitle: "Settings", settingsThemeHeading: "Theme",
        settingsLightMode: "Light Mode", settingsDarkMode: "Dark Mode", settingsDataHeading: "Data Management",
        settingsResetBtn: "Reset Saved Data", settingsResetInfo: "Clears theme, welcome status, and all saved lesson statistics.",
        settingsCloseBtn: "Close",
        statsTitle: "Overall Statistics", statsAnswersLabel: "Answers", statsTimeLabel: "Time", statsTotalLabel: "Total",
        matchingInstruction: "Click an item on the left, then its corresponding item on the right. Click a matched item again to deselect the pair.",
        orderingInstruction: "Select the correct order number ({num}) for each item.",
        matchingItemsHeader: "Items", matchingMatchesHeader: "Matches",
        defaultErrorMessage: "Could not load questions for this lesson.",
        leaveQuizConfirm: "Leave the current quiz? Progress will be lost.",
        resetDataConfirm: "Reset all saved data (theme, stats)? This cannot be undone.",
        resetDataAlert: "Data has been reset. Reloading the page.",
        reviewStatusCorrect: "✓ Correct", reviewStatusIncorrect: "✗ Incorrect",
        reviewStatusPartial: "~ Partial ({correct}/{total})", reviewStatusUnanswered: "Unanswered",
        quizResultExcellent: "Excellent! 🎉", quizResultGreat: "Great Job! 👍",
        quizResultGood: "Good Effort! 💪", quizResultPractice: "Keep Practicing! 📚",
        quizResultNoQuestions: "No questions in this quiz.",
        quizTitlePrefix: "Quiz", reviewTitlePrefix: "Review",
        selectAnswerPrompt: "Please select an answer.", // Added for MC check
        correctFeedback: "Correct! ✓", // Added for default correct
        incorrectFeedback: "Incorrect.", // Added for default incorrect
        correctAnswerIs: "Correct answer:", // Added for default incorrect feedback
        matchingNoMatchNeeded: "No matching needed.", // Added for matching check
        matchingAllCorrect: "Correct! ✓ All matched.", // Added for matching check
        matchingPartialCorrect: "Partial correct: {correct}/{total}.", // Added for matching check
        matchingNoneCorrect: "Incorrect: 0/{total} matched.", // Added for matching check
        orderingInvalidData: "Error: Invalid ordering setup.", // Added for ordering check
        orderingSelectionError: "Error processing selections.", // Added for ordering check
        orderingSelectAll: "Please select an order for all items.", // Added for ordering check
        orderingUseEachNumOncePlural: "numbers 1-{n}", // Added for ordering check
        orderingUseEachNumOnceSingular: "number 1", // Added for ordering check
        orderingDuplicateUse: "Please use each order {nums} exactly once.", // Added for ordering check
        orderingSequenceError: "Error processing sequence.", // Added for ordering check
    },
    ar: {
         firstSemester: "الفصل الأول", secondSemester: "الفصل الثاني",
         backToTopics: "العودة للمواضيع", submit: "إرسال", next: "السؤال التالي",
         viewResults: "عرض النتائج",
         resultsSubjectLabel: "المادة:", resultsSemesterLabel: "الفصل:",
         resultsUnitLabel: "الوحدة:", resultsLessonLabel: "الدرس:", resultsCorrectLabel: "الصحيحة:",
         resultsTimeLabel: "الوقت:", resultsYourAnswerLabel: "إجابتك:", resultsCorrectAnswerLabel: "الإجابة الصحيحة:",
         redoQuiz: "إعادة الاختبار", reviewAnswers: "مراجعة الإجابات",
         backToResults: "العودة للنتائج",
         settingsTitle: "الإعدادات", settingsThemeHeading: "السمة",
         settingsLightMode: "وضع فاتح", settingsDarkMode: "وضع داكن", settingsDataHeading: "إدارة البيانات",
         settingsResetBtn: "إعادة تعيين البيانات", settingsResetInfo: "يمسح تفضيلات السمة وحالة شاشة الترحيب وجميع إحصائيات الدروس المحفوظة.",
         settingsCloseBtn: "إغلاق",
         statsTitle: "الإحصائيات العامة", statsAnswersLabel: "الاجابات", statsTimeLabel: "الوقت", statsTotalLabel: "المجموع",
         matchingInstruction: "انقر على عنصر في القائمة الأولى، ثم على العنصر المقابل له في القائمة الثانية. انقر على زوج متطابق مرة أخرى لإلغاء التحديد.",
         orderingInstruction: "حدد رقم الترتيب الصحيح ({num}) لكل عنصر.",
         matchingItemsHeader: "العناصر", matchingMatchesHeader: "المطابقات",
         defaultErrorMessage: "تعذر تحميل أسئلة هذا الدرس.",
         leaveQuizConfirm: "هل تريد مغادرة الاختبار الحالي؟ سيتم فقدان التقدم.",
         resetDataConfirm: "هل أنت متأكد من إعادة تعيين جميع البيانات المحفوظة (السمة، الإحصائيات)؟ لا يمكن التراجع عن هذا الإجراء.",
         resetDataAlert: "تمت إعادة تعيين البيانات. جارٍ إعادة تحميل الصفحة.",
         reviewStatusCorrect: "✓ صحيح", reviewStatusIncorrect: "✗ خطأ",
         reviewStatusPartial: "~ جزئي ({correct}/{total})", reviewStatusUnanswered: "لم تتم الإجابة",
         quizResultExcellent: "ممتاز! 🎉", quizResultGreat: "عمل رائع! 👍",
         quizResultGood: "مجهود جيد! 💪", quizResultPractice: "استمر في الممارسة! 📚",
         quizResultNoQuestions: "لا توجد أسئلة في هذا الاختبار.",
         quizTitlePrefix: "اختبار", reviewTitlePrefix: "مراجعة",
         selectAnswerPrompt: "الرجاء اختيار إجابة.", // Added AR
         correctFeedback: "صحيح! ✓", // Added AR
         incorrectFeedback: "خطأ.", // Added AR
         correctAnswerIs: "الإجابة الصحيحة:", // Added AR
         matchingNoMatchNeeded: "لا يوجد تطابق مطلوب.", // Added AR
         matchingAllCorrect: "صحيح! ✓ تمت مطابقة الكل.", // Added AR
         matchingPartialCorrect: "صحيح جزئياً: {correct}/{total}.", // Added AR
         matchingNoneCorrect: "خطأ: 0/{total} مطابقة.", // Added AR
         orderingInvalidData: "خطأ: إعداد الترتيب غير صالح.", // Added AR
         orderingSelectionError: "خطأ في معالجة الاختيارات.", // Added AR
         orderingSelectAll: "الرجاء تحديد ترتيب لجميع العناصر.", // Added AR
         orderingUseEachNumOncePlural: "الأرقام من 1 إلى {n}", // Added AR
         orderingUseEachNumOnceSingular: "الرقم 1", // Added AR
         orderingDuplicateUse: "الرجاء استخدام كل ترتيب {nums} مرة واحدة بالضبط.", // Added AR
         orderingSequenceError: "خطأ في معالجة التسلسل.", // Added AR
    }
};

// --- Global DOM Element Variables ---
// Defined globally, assigned in DOMContentLoaded
let contentElement, quizViewElement, quizTitleElement, quizContainerElement,
    feedbackContainerElement, quizButtonsContainerElement, matchingSvgElement,
    navSectionElement, welcomeViewElement, mainContainerElement,
    settingsModalElement, settingsButtonElement, statsModalElement, statsButtonElement;

// --- State/Helper Variables ---
let matchingArrowObserver = null;
let resizeTimeout = null;

// --- Utility Functions ---
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // Swap
    }
    return newArray;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function formatTime(seconds) {
    if (seconds === null || seconds <= 0 || isNaN(seconds)) return '0s';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${remainingSeconds}s`;
}

function getLessonStorageKey(subject, semester, unit, lesson) {
    // Simple sanitization: replace spaces with _, dashes with __
    const sanitize = str => (str || '').replace(/\s+/g, '_').replace(/-/g, '__');
    return `${sanitize(subject)}-${sanitize(semester)}-${sanitize(unit)}-${sanitize(lesson)}`;
}

function getCurrentLang() {
    // Check HTML lang attribute first, fallback to English
    return document.documentElement.lang || 'en';
}

function getStrings() {
    const lang = getCurrentLang();
    return uiStrings[lang] || uiStrings.en; // Fallback to English if lang not found
}


// --- Lesson Stats Management ---
function loadLessonStats() {
    try {
        const storedStats = localStorage.getItem(LS_STATS_KEY);
        allLessonStats = storedStats ? JSON.parse(storedStats) : {};
    } catch (e) {
        console.error("Failed to load lesson stats:", e);
        allLessonStats = {}; // Reset on error
    }
}

function saveLessonStats(subject, semester, unit, lesson, score, total, time) {
    const key = getLessonStorageKey(subject, semester, unit, lesson);
    const existingStat = allLessonStats[key];
    let updated = false;

    // Check if new stats are better or if it's the first time
    if (!existingStat || !existingStat.totalQuestions) { // First time or corrupted data
        allLessonStats[key] = {
            bestScore: score,
            totalQuestions: total,
            bestTime: time
        };
        updated = true;
    } else {
        // Update if score is better
        if (score > existingStat.bestScore) {
            existingStat.bestScore = score;
            existingStat.bestTime = time;
            existingStat.totalQuestions = total; // Update total Qs too
            updated = true;
        }
        // Update if score is same but time is better
        else if (score === existingStat.bestScore && time < existingStat.bestTime) {
            existingStat.bestTime = time;
            // existingStat.totalQuestions = total; // Ensure total is updated if needed
            updated = true;
        }
        // Always update total questions if it changed (e.g., questions added/removed)
        if (total !== existingStat.totalQuestions) {
             existingStat.totalQuestions = total;
             // If total changed, might need to reset best score/time depending on desired logic
             // For now, just update total. If score > new total, something is wrong elsewhere.
             if (existingStat.bestScore > total) {
                 existingStat.bestScore = total; // Cap score at new total
             }
             updated = true;
        }
    }

    // Save to localStorage if anything was updated
    if (updated) {
        try {
            localStorage.setItem(LS_STATS_KEY, JSON.stringify(allLessonStats));
        } catch (e) {
            console.error("Failed to save lesson stats:", e);
        }
    }
}

function updateLessonBoxDisplays() {
    // Find the currently active semester content div
    const activeSemesterDiv = document.querySelector('.semester-content.active');
    if (!activeSemesterDiv) return; // No active semester visible

    const lessonBoxes = activeSemesterDiv.querySelectorAll('.section-content');

    lessonBoxes.forEach(box => {
        const subject = box.dataset.subject;
        const semester = box.dataset.semester;
        const unit = box.dataset.unit;
        const lesson = box.dataset.lesson;
        const statsDisplay = box.querySelector('.lesson-stats-display');
        const qCountDisplay = box.querySelector('.lesson-q-count');

        if (!subject || !semester || !unit || !lesson || !statsDisplay) return; // Skip if essential data is missing

        const key = getLessonStorageKey(subject, semester, unit, lesson);
        const stat = allLessonStats[key];

        // Reset styles and text first
        box.classList.remove('lesson-complete-perfect', 'lesson-complete-imperfect');
        statsDisplay.textContent = '';
        if (qCountDisplay) qCountDisplay.style.display = ''; // Show Q count by default

        // Apply stats if available
        if (stat && stat.totalQuestions > 0) {
            const scoreText = `🏆 ${stat.bestScore}/${stat.totalQuestions}`;
            const timeText = `⏱️ ${formatTime(stat.bestTime)}`;
            statsDisplay.textContent = `${scoreText} | ${timeText}`;
            // if (qCountDisplay) qCountDisplay.style.display = 'none'; // Hide Q count if stats shown

            // Add completion classes
            if (stat.bestScore === stat.totalQuestions) {
                box.classList.add('lesson-complete-perfect');
            } else {
                box.classList.add('lesson-complete-imperfect');
            }
        } else {
            // Ensure Q count is visible if no stats
             if (qCountDisplay) qCountDisplay.style.display = '';
        }
    });
}


// --- UI Language Update ---
function updateUiLanguage(lang = 'en') {
    const strings = uiStrings[lang] || uiStrings.en; // Use provided lang or fallback
    const isRTL = lang === 'ar';
    document.documentElement.lang = lang; // Set page language

    // Helper to set text, handling potential inner spans for buttons
    const setText = (elementId, textKey, options = {}) => {
        const element = document.getElementById(elementId);
        let text = strings[textKey] || uiStrings.en[textKey] || ''; // Fallback text
         if (options.num !== undefined) { text = text.replace('{num}', `1-${options.num}`); } // Placeholder

        if (element) {
            // Check if it's a button with a specific structure
            const textSpan = element.querySelector('.btn-text');
            if (textSpan) {
                textSpan.textContent = text;
            } else {
                // Check if it's a simple element like h3, p
                element.textContent = text; // Set text directly
            }
        } else if (options.selector) { // Allow using selectors for non-ID elements
             const elements = document.querySelectorAll(options.selector);
             elements.forEach(el => { el.textContent = text; });
        }
    };

    // Helper for results details labels
     const setDetailLabel = (key, textKey) => {
         const text = strings[textKey] || uiStrings.en[textKey] || '';
         // Find the <p> by data-detail-key, then its <strong> child
         const pElement = document.querySelector(`.results-details p[data-detail-key="${key}"] strong`);
         if (pElement) pElement.textContent = text;
     };

    // --- Update Static & Dynamic Elements ---
    // Navigation
    setText('semester-btn-first', 'firstSemester');
    setText('semester-btn-second', 'secondSemester');

    // Modals
    setText('settings-modal-close-footer', 'settingsCloseBtn'); // Footer button
    setText('reset-data-button', 'settingsResetBtn');
    setText('stats-modal-close-footer', 'settingsCloseBtn'); // Stats modal close
    setText('stats-modal-title', 'statsTitle'); // Stats Modal Title

    // Buttons that might exist depending on view
    setText('back-to-topics-btn', 'backToTopics'); // In quiz header
    setText('submit-btn', 'submit'); // In quiz footer (initially)

    // Smart update for Next/View Results button
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) {
         // Determine state based on quizState
         const nextBtnTextKey = (quizState.currentQuestionIndex === quizState.totalQuestions - 1 && quizState.totalQuestions > 0)
             ? 'viewResults'
             : 'next';
         setText('next-btn', nextBtnTextKey);
    }

    // Buttons in results/review/error views (use IDs if unique)
    setText('redo-btn', 'redoQuiz');
    setText('review-btn', 'reviewAnswers');
    setText('back-to-topics-btn-results', 'backToTopics'); // Results view back button
    setText('back-btn', 'backToResults'); // Review view back button
    setText('back-to-topics-btn-review', 'backToTopics'); // Review view back button
    setText('back-to-topics-btn-error', 'backToTopics'); // Error view back button

    // Quiz Title (handle different states)
    if (quizTitleElement) {
        if (quizContainerElement && quizContainerElement.querySelector('.results-container')) {
            // Results View
            quizTitleElement.textContent = strings.viewResults || 'Quiz Results';
        } else if (quizContainerElement && quizContainerElement.querySelector('.review-container')) {
            // Review View
            quizTitleElement.textContent = `${strings.reviewTitlePrefix || 'Review'}: ${quizState.lesson || ''}`;
        } else if (quizContainerElement && quizContainerElement.querySelector('.error-display')) {
            // Error View
             quizTitleElement.textContent = strings.defaultErrorMessage.includes('load') ? strings.defaultErrorMessage : 'Error';
        } else if (quizState.lesson) {
            // Quiz in Progress
            quizTitleElement.textContent = `${strings.quizTitlePrefix || 'Quiz'}: ${quizState.lesson}`;
        } else {
            // Default or placeholder if no state matches
             quizTitleElement.textContent = strings.quizTitlePrefix || 'Quiz';
        }
    }

    // Settings Modal text
    const settingsM = document.getElementById('settings-modal');
    if(settingsM) {
        // Use querySelector within the modal context
        const modalTitle = settingsM.querySelector('.modal-title');
        if (modalTitle) modalTitle.textContent = strings.settingsTitle || 'Settings';

        const themeHeading = settingsM.querySelector('.modal-section:nth-of-type(1) h4');
        if (themeHeading) themeHeading.textContent = strings.settingsThemeHeading || 'Theme';

        const lightLabel = settingsM.querySelector('label input[value="light"]')?.parentElement;
        if(lightLabel) lightLabel.childNodes[lightLabel.childNodes.length-1].nodeValue = ` ${strings.settingsLightMode || 'Light Mode'} ☀️`; // Assumes text is last node

        const darkLabel = settingsM.querySelector('label input[value="dark"]')?.parentElement;
        if(darkLabel) darkLabel.childNodes[darkLabel.childNodes.length-1].nodeValue = ` ${strings.settingsDarkMode || 'Dark Mode'} 🌙`;

        const dataHeading = settingsM.querySelector('.modal-section:nth-of-type(2) h4');
        if(dataHeading) dataHeading.textContent = strings.settingsDataHeading || 'Data Management';

        const resetInfo = settingsM.querySelector('.modal-section:nth-of-type(2) p');
        if(resetInfo) resetInfo.textContent = strings.settingsResetInfo || '';
    }

     // Results Details Labels (Ensure these are called *after* results view is rendered if dynamic)
     setDetailLabel('subject', 'resultsSubjectLabel');
     setDetailLabel('semester', 'resultsSemesterLabel');
     setDetailLabel('unit', 'resultsUnitLabel');
     setDetailLabel('lesson', 'resultsLessonLabel');
     setDetailLabel('correct', 'resultsCorrectLabel');
     setDetailLabel('time', 'resultsTimeLabel');

     // Instructions (if quiz view is active and elements exist)
     const matchingInstructions = document.querySelector('.matching-instructions');
     if(matchingInstructions) matchingInstructions.textContent = strings.matchingInstruction || '';

     const orderingInstructions = document.querySelector('.ordering-instructions');
     if(orderingInstructions) {
         // Get number of items from current question state if available
         const numItems = quizState?.questions?.[quizState.currentQuestionIndex]?.items?.length || 0;
         const instructionText = strings.orderingInstruction || '';
         // Replace placeholder, handle case of 0 items
         orderingInstructions.textContent = numItems > 0 ? instructionText.replace('{num}', `1-${numItems}`) : instructionText.replace('{num}', 'N/A');
     }

     // Matching Headers (if quiz view is active and elements exist)
     const itemsHeader = document.querySelector('#prompts-column h4');
     if (itemsHeader) itemsHeader.textContent = strings.matchingItemsHeader || 'Items';
     const matchesHeader = document.querySelector('#matches-column h4');
     if (matchesHeader) matchesHeader.textContent = strings.matchingMatchesHeader || 'Matches';

     // Result Header Message (Ensure this is called *after* results view is rendered)
     const resultHeader = document.querySelector('.results-header');
     if (resultHeader) {
         // Calculate score percentage if state is available
         const score = quizState.totalQuestions > 0 ? (quizState.correctAnswers / quizState.totalQuestions) * 100 : 0;
         let msgKey = 'quizResultPractice'; // Default message
         if (quizState.totalQuestions === 0) msgKey = 'quizResultNoQuestions';
         else if (score >= 90) msgKey = 'quizResultExcellent';
         else if (score >= 70) msgKey = 'quizResultGreat';
         else if (score >= 50) msgKey = 'quizResultGood';
         resultHeader.textContent = strings[msgKey] || ''; // Set the message text
     }
}


// --- RTL and Theme Management ---
function setRtlLayout(enable) {
    if (!mainContainerElement) return;
    const lang = enable ? 'ar' : 'en';
    mainContainerElement.classList.toggle('rtl-layout', enable);

    // Update language only if it needs to change based on RTL state
    if (document.documentElement.lang !== lang) {
        updateUiLanguage(lang);
    }
}

function applyTheme(theme) {
    document.body.classList.toggle('dark-theme', theme === 'dark');
    // Update radio button selection in settings modal if it exists
    const themeRadios = settingsModalElement?.querySelectorAll('input[name="theme"]');
    if (themeRadios) {
        themeRadios.forEach(radio => {
            radio.checked = radio.value === theme;
        });
    }
}

function handleThemeChange(event) {
    const newTheme = event.target.value;
    applyTheme(newTheme);
    localStorage.setItem(LS_THEME_KEY, newTheme);
}

function loadAndApplyTheme() {
    const savedTheme = localStorage.getItem(LS_THEME_KEY);
    // Default to 'dark' if no theme is saved
    const currentTheme = savedTheme || 'dark';
    applyTheme(currentTheme);
    // If no theme was saved, save the default ('dark')
    if (!savedTheme) {
        localStorage.setItem(LS_THEME_KEY, 'dark');
    }
}

function toggleSettingsModal(show) {
    if (!settingsModalElement) return;
    if (show) {
        // Ensure correct radio button is checked before showing
        const currentTheme = localStorage.getItem(LS_THEME_KEY) || 'dark';
        const themeRadios = settingsModalElement.querySelectorAll('input[name="theme"]');
        themeRadios.forEach(radio => { radio.checked = radio.value === currentTheme; });

        settingsModalElement.classList.remove('hidden');
        // Use timeout to allow transition after display:flex is applied
        setTimeout(() => settingsModalElement.classList.add('visible'), 10);
    } else {
        settingsModalElement.classList.remove('visible');
        // Use timeout to hide after transition ends
        setTimeout(() => settingsModalElement.classList.add('hidden'), 300); // Match transition duration
    }
}


// --- Function to calculate total questions per subject from topicsData ---
function calculateSubjectTotals() {
    // console.log("Calculating total questions per subject..."); // Debug log
    subjectTotalQuestions = {}; // Reset before calculating
    // Check if topicsData is loaded
    if (typeof topicsData === 'undefined' || !topicsData) {
        console.error("topicsData is not available for calculateSubjectTotals.");
        return;
    }

    for (const subject in topicsData) {
        if (topicsData.hasOwnProperty(subject)) {
            let totalQs = 0;
            // Iterate through both semesters for the subject
            for (const semester in topicsData[subject]) {
                if (topicsData[subject].hasOwnProperty(semester) && topicsData[subject][semester].units) {
                    topicsData[subject][semester].units.forEach(unit => {
                        if (unit.lessons) {
                            unit.lessons.forEach(lesson => {
                                // Safely add the count of questions, default to 0 if undefined/null
                                totalQs += lesson.questions?.length || 0;
                            });
                        }
                    });
                }
            }
            subjectTotalQuestions[subject] = totalQs; // Store the total for this subject
        }
    }
    // console.log("Pre-calculated Subject Totals:", subjectTotalQuestions); // Debug log
}


// --- Stats Modal ---
function toggleStatsModal(show) {
    if (!statsModalElement) return;
    if (show) {
        populateStatsModal(); // Calculate and fill data before showing
        statsModalElement.classList.remove('hidden');
        setTimeout(() => statsModalElement.classList.add('visible'), 10);
    } else {
        statsModalElement.classList.remove('visible');
        setTimeout(() => statsModalElement.classList.add('hidden'), 300);
    }
}

function calculateOverallStats() {
    const subjectStats = {};
    // Initialize stats object using the pre-calculated totals and defined order
    STATS_SUBJECT_ORDER.forEach(subj => {
        subjectStats[subj] = {
            answered: 0,
            total: subjectTotalQuestions[subj] || 0, // Get total from pre-calculated map
            time: 0
        };
    });

    let overallAnswered = 0;
    let overallTime = 0;
    // overallTotal will be calculated at the end by summing subject totals

    // Iterate through COMPLETED lesson stats to get ANSWERED counts and TIME
    for (const key in allLessonStats) {
        if (allLessonStats.hasOwnProperty(key)) {
            // Attempt to parse the key to get the subject
            const parts = key.split('-');
            // Reconstruct subject name (handle spaces replaced by _ and hyphens by __)
            const subject = parts[0].replace(/__/g, '-').replace(/_/g, ' ');
            const stat = allLessonStats[key];

            // Check if the subject is one we are tracking and if the stat is valid
            if (subjectStats[subject] !== undefined && stat && stat.totalQuestions > 0) {
                // Add the best score achieved for completed lessons
                subjectStats[subject].answered += stat.bestScore;
                // Add the best time for completed lessons
                subjectStats[subject].time += stat.bestTime;

                // Accumulate overall answered and time
                overallAnswered += stat.bestScore;
                overallTime += stat.bestTime;

                // DO NOT update subjectStats[subject].total here - it's fixed
            } else if (subjectStats[subject] === undefined) {
                // This might happen if stats exist for a subject not in STATS_SUBJECT_ORDER
                // console.warn(`Subject "${subject}" found in stats but not configured for display.`);
            }
        }
    }

    // Calculate the overall total by summing the pre-calculated totals for the displayed subjects
    let overallTotal = 0;
    STATS_SUBJECT_ORDER.forEach(subj => {
        overallTotal += subjectTotalQuestions[subj] || 0;
    });

    // console.log("Calculated Stats:", { subjectStats, overallAnswered, overallTotal, overallTime }); // Debug log
    return { subjectStats, overallAnswered, overallTotal, overallTime };
}

function populateStatsModal() {
    const { subjectStats, overallAnswered, overallTotal, overallTime } = calculateOverallStats();
    const tbody = document.getElementById('stats-table-body');
    const strings = getStrings();
    if (!tbody) return;

    tbody.innerHTML = ''; // Clear previous rows

    // --- Header Row (Optional, if structure might change) ---
    // const thead = document.getElementById('stats-table')?.querySelector('thead tr');
    // if (thead) {
    //     thead.innerHTML = `<th>${strings.statsSubjectLabel || 'Subject'}</th>`; // First column header
    //     STATS_SUBJECT_ORDER.forEach(subj => {
    //         const th = document.createElement('th');
    //         th.textContent = subj; // Use actual subject name
    //         thead.appendChild(th);
    //     });
    //     thead.innerHTML += `<th>${strings.statsTotalLabel || 'Total'}</th>`; // Last column header
    // }

    // --- Answers Row ---
    const answersRow = tbody.insertRow();
    const answersLabelCell = answersRow.insertCell();
    answersLabelCell.textContent = strings.statsAnswersLabel || 'Answers';

    STATS_SUBJECT_ORDER.forEach(subj => {
        const cell = answersRow.insertCell();
        const stats = subjectStats[subj];
        // Display answered/total using the pre-calculated total
        cell.textContent = stats ? `${stats.answered}/${stats.total}` : '0/0';
    });
    // Total Answers Cell
    const totalAnswersCell = answersRow.insertCell();
    totalAnswersCell.textContent = `${overallAnswered}/${overallTotal}`; // Use calculated overall total

    // --- Time Row ---
    const timeRow = tbody.insertRow();
    const timeLabelCell = timeRow.insertCell();
    timeLabelCell.textContent = strings.statsTimeLabel || 'Time';

    STATS_SUBJECT_ORDER.forEach(subj => {
        const cell = timeRow.insertCell();
        const stats = subjectStats[subj];
        cell.textContent = stats ? formatTime(stats.time) : '0s';
    });
    // Total Time Cell
    const totalTimeCell = timeRow.insertCell();
    totalTimeCell.textContent = formatTime(overallTime);
}


function resetSavedData() {
    const strings = getStrings();
    const confirmMsg = strings.resetDataConfirm || 'Reset all saved data (theme, stats)? This cannot be undone.';
    if (confirm(confirmMsg)) {
        localStorage.removeItem(LS_THEME_KEY);
        localStorage.removeItem(LS_VISITED_KEY);
        localStorage.removeItem(LS_STATS_KEY);
        allLessonStats = {}; // Clear in-memory stats
        // No need to recalculate subjectTotalQuestions as it comes from topicsData
        alert(strings.resetDataAlert || 'Data has been reset. Reloading the page.');
        location.reload(); // Reload to apply changes and clear state
    }
}

// --- Welcome Screen Logic ---
function handleWelcome() {
    // Ensure elements exist
    if (!welcomeViewElement || !mainContainerElement) return;

    const hasVisited = localStorage.getItem(LS_VISITED_KEY);

    if (hasVisited) {
        // Hide welcome, show main content immediately
        welcomeViewElement.classList.add('hidden');
        mainContainerElement.classList.remove('initially-hidden');
        mainContainerElement.style.opacity = 1; // Ensure it's visible
    } else {
        // Show welcome, hide main content
        welcomeViewElement.classList.remove('hidden');
        mainContainerElement.classList.add('initially-hidden');
        mainContainerElement.style.opacity = 0; // Start faded out

        // Add listener to the "Get Started" button
        const startButton = welcomeViewElement.querySelector('.get-started-btn');
        if (startButton) {
            startButton.addEventListener('click', () => {
                localStorage.setItem(LS_VISITED_KEY, 'true'); // Mark as visited
                // Animate transition
                welcomeViewElement.classList.add('hidden'); // Hide welcome
                mainContainerElement.classList.remove('initially-hidden'); // Allow interaction
                // Use timeout to allow display change before starting opacity transition
                setTimeout(() => {
                    mainContainerElement.style.opacity = 1;
                     // Update content *after* main container is visible
                     updateContent();
                }, 50); // Small delay
            }, { once: true }); // Ensure listener runs only once
        }
    }
}

// --- DOM Ready Listener ---
document.addEventListener('DOMContentLoaded', () => {
    // Assign global DOM elements
    welcomeViewElement = document.getElementById('welcome-view');
    mainContainerElement = document.querySelector('.container');
    contentElement = document.getElementById('content');
    quizViewElement = document.getElementById('quiz-view');
    quizTitleElement = document.getElementById('quiz-title');
    quizContainerElement = document.getElementById('quiz-container');
    feedbackContainerElement = document.getElementById('feedback-container');
    quizButtonsContainerElement = document.getElementById('quiz-buttons-container');
    navSectionElement = document.querySelector('.nav-section');
    settingsButtonElement = document.getElementById('settings-btn');
    settingsModalElement = document.getElementById('settings-modal');
    statsButtonElement = document.getElementById('stats-btn');
    statsModalElement = document.getElementById('stats-modal');
    // matchingSvgElement is assigned dynamically when a matching question is rendered

    // Initial Setup
    calculateSubjectTotals(); // Calculate totals from topicsData (needs topicsData loaded)
    loadAndApplyTheme();
    loadLessonStats();
    handleWelcome(); // Manage welcome screen vs main content visibility

    // Determine initial language/RTL based on the *default* active subject button in HTML
    const initialSubjectBtn = document.querySelector('.nav-btn.active');
    const initialSubject = initialSubjectBtn?.dataset.subject || 'english'; // Default to 'english' if none active
    const initialLang = RTL_SUBJECTS.includes(initialSubject) ? 'ar' : 'en';
    setRtlLayout(RTL_SUBJECTS.includes(initialSubject)); // Set initial RTL
    updateUiLanguage(initialLang); // Set initial language

    // Add Event Listeners

    // Settings Modal
    if (settingsButtonElement) settingsButtonElement.addEventListener('click', () => toggleSettingsModal(true));
    if (settingsModalElement) {
        // Theme Radios
        const themeRadios = settingsModalElement.querySelectorAll('input[name="theme"]');
        themeRadios.forEach(radio => radio.addEventListener('change', handleThemeChange));
        // Reset Button
        const resetBtn = document.getElementById('reset-data-button');
        if (resetBtn) resetBtn.addEventListener('click', resetSavedData);
        // Close on overlay click
        settingsModalElement.addEventListener('click', (e) => { if (e.target === settingsModalElement) toggleSettingsModal(false); });
         // Explicit close buttons
        const closeHeaderBtn = document.getElementById('settings-modal-close-header');
        if (closeHeaderBtn) closeHeaderBtn.addEventListener('click', () => toggleSettingsModal(false));
        const closeFooterBtn = document.getElementById('settings-modal-close-footer'); // Added this
        if (closeFooterBtn) closeFooterBtn.addEventListener('click', () => toggleSettingsModal(false));
    }

    // Stats Modal
    if (statsButtonElement) statsButtonElement.addEventListener('click', () => toggleStatsModal(true));
    if (statsModalElement) {
        // Close on overlay click
        statsModalElement.addEventListener('click', (e) => { if (e.target === statsModalElement) toggleStatsModal(false); });
        // Explicit close buttons
        const closeHeaderBtn = document.getElementById('stats-modal-close-header');
        if (closeHeaderBtn) closeHeaderBtn.addEventListener('click', () => toggleStatsModal(false));
        const closeFooterBtn = document.getElementById('stats-modal-close-footer'); // Added this
        if (closeFooterBtn) closeFooterBtn.addEventListener('click', () => toggleStatsModal(false));
    }

    // Subject Buttons
    document.querySelectorAll('.nav-btn[data-subject]').forEach(button => {
        button.addEventListener('click', function() { // Use 'function' for 'this' context
            const strings = getStrings();
            const confirmMsg = strings.leaveQuizConfirm || "Leave quiz?";
            // Confirm if leaving an active quiz
            if (!quizViewElement.classList.contains('hidden') && !confirm(confirmMsg)) {
                return; // Don't switch if user cancels
            }
            showTopicList(); // Ensure back in topic view & cleanup quiz state if needed

            // Update active button state
            document.querySelectorAll('.nav-btn[data-subject]').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active'); // 'this' refers to the clicked button

            updateContent(); // Update content based on new selection
        });
    });

    // Semester Buttons
    document.querySelectorAll('.semester-btn').forEach(button => {
        button.addEventListener('click', function() {
            const strings = getStrings();
            const confirmMsg = strings.leaveQuizConfirm || "Leave quiz?";
            if (!quizViewElement.classList.contains('hidden') && !confirm(confirmMsg)) {
                return;
            }
            showTopicList();

            // Update active semester button
            document.querySelectorAll('.semester-btn').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            updateContent(); // Update displayed semester content
        });
    });

    // Lesson Click (using event delegation on #content)
    if (contentElement) {
        contentElement.addEventListener('click', (event) => {
            const lessonElement = event.target.closest('.section-content');
            if (lessonElement) {
                const strings = getStrings();
                const confirmMsg = strings.leaveQuizConfirm || "Leave quiz?";
                // Only confirm if actually in quiz view
                if (!quizViewElement.classList.contains('hidden') && !confirm(confirmMsg)) {
                    return; // Stop if user cancels
                }
                // If confirmed or not in quiz view, proceed
                if (!quizViewElement.classList.contains('hidden')) {
                    // Explicitly call cleanup when starting a new quiz from quiz view
                    // showTopicList() implicitly does cleanup now, but this is clearer
                    cleanupQuizView();
                }

                // Get lesson data from attributes
                const subject = lessonElement.dataset.subject;
                const semester = lessonElement.dataset.semester;
                const unit = lessonElement.dataset.unit;
                const lesson = lessonElement.dataset.lesson;

                // Start the quiz for the selected lesson
                handleSectionClick(subject, semester, unit, lesson);
            }
        });
    }

    // Resize listener for matching arrows
    window.addEventListener('resize', debounce(updateAllArrowPositions, 250));

    // Initial content update *only if* user has passed the welcome screen
    if (localStorage.getItem(LS_VISITED_KEY)) {
         updateContent();
    }
});

// --- View Management ---
function showTopicList() {
    // Ensure elements are available
    if (!mainContainerElement || !contentElement || !quizViewElement || !navSectionElement) return;

    // Determine current subject and RTL status *before* changing views
    const currentSubject = document.querySelector('.nav-btn.active')?.dataset.subject || 'english';
    const isRTL = RTL_SUBJECTS.includes(currentSubject);

    // Show/Hide relevant sections
    mainContainerElement.classList.remove('hidden'); // Should always be visible unless welcome
    contentElement.classList.remove('hidden');
    quizViewElement.classList.add('hidden');
    navSectionElement.classList.remove('hidden');

    // Set layout and language based on the *currently selected subject*
    setRtlLayout(isRTL);
    // No need to call updateUiLanguage here if setRtlLayout handles it

    // Update topic list content and stats display
    updateContent();

    // Cleanup any quiz-specific state or elements
    cleanupQuizView();

    // Optional: Scroll to top of container for better UX
    mainContainerElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showQuizView() {
    if (mainContainerElement && contentElement && quizViewElement && navSectionElement) {
        mainContainerElement.classList.remove('hidden');
        contentElement.classList.add('hidden');
        quizViewElement.classList.remove('hidden');
        navSectionElement.classList.add('hidden');
        // Scroll to the top of the quiz view when it's shown
        quizViewElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function cleanupQuizView() {
    // Disconnect MutationObserver if it exists
    if (matchingArrowObserver) {
        matchingArrowObserver.disconnect();
        matchingArrowObserver = null;
        // console.log("Matching observer disconnected."); // Debug
    }
    // Remove SVG element if it exists
    if (matchingSvgElement && matchingSvgElement.parentNode) {
        matchingSvgElement.remove();
        matchingSvgElement = null;
        // console.log("Matching SVG removed."); // Debug
    }
    // Destroy SortableJS instances (if using Drag-and-Drop alternative)
    quizState.matchingState?.sortableInstances?.forEach(instance => instance.destroy());

    // Reset quiz state (key parts needed for starting fresh)
    quizState = {
        currentQuestionIndex: 0, correctAnswers: 0, totalQuestions: 0,
        startTime: null, endTime: null, selectedAnswers: [], questions: [],
        originalQuestions: [], subject: '', unit: '', lesson: '', semester: '',
        matchingState: { selectedPromptElement: null, selectedMatchElement: null, userPairs: {}, sortableInstances: [] }
    };
    // console.log("Quiz state reset."); // Debug

     // Clear dynamic containers
     if (quizContainerElement) quizContainerElement.innerHTML = '';
     if (feedbackContainerElement) {
         feedbackContainerElement.innerHTML = '';
         feedbackContainerElement.classList.add('hidden');
     }
     if (quizButtonsContainerElement) quizButtonsContainerElement.innerHTML = '';
}


// --- Core Functions ---

function updateContent() {
    const activeSubjectBtn = document.querySelector('.nav-btn[data-subject].active');
    const activeSemesterBtn = document.querySelector('.semester-btn.active');

    // Ensure selections are valid and content element exists
    if (!activeSubjectBtn || !activeSemesterBtn || !contentElement) {
        console.warn("updateContent: Missing active buttons or content element.");
        return;
    }

    const activeSubject = activeSubjectBtn.dataset.subject;
    const activeSemester = activeSemesterBtn.dataset.semester;
    const sanitizedSubject = activeSubject.replace(/\s+/g, '-'); // Used for ID matching
    const isRTL = RTL_SUBJECTS.includes(activeSubject);
    const lang = isRTL ? 'ar' : 'en';

    // Set RTL layout first
    setRtlLayout(isRTL);
    // Update language if needed (setRtlLayout might have already done it)
    if(document.documentElement.lang !== lang) {
        updateUiLanguage(lang);
    }

    // Hide all semester contents first to ensure only the correct one shows
    contentElement.querySelectorAll('.semester-content').forEach(contentDiv => {
        contentDiv.classList.remove('active');
    });

    // Construct the ID for the target semester content div
    const contentId = `${sanitizedSubject}-${activeSemester}`;
    const targetSemesterContent = contentElement.querySelector(`#${contentId}`);

    // Show the active semester content if found
    if (targetSemesterContent) {
        targetSemesterContent.classList.add('active');
        // Update the stats display for the now visible lessons
        updateLessonBoxDisplays();
    } else {
        console.warn(`Semester content ID "#${contentId}" not found.`);
        // Optionally display a message if content is missing
        // contentElement.innerHTML = `<p>Content for ${activeSubject} - ${activeSemester} not found.</p>`;
    }
}

function handleSectionClick(subject, semester, unit, lesson) {
    // Validate input
    if (!subject || !semester || !unit || !lesson) {
        const strings = getStrings();
        alert(strings.defaultErrorMessage || "Error identifying topic.");
        console.error("handleSectionClick: Missing parameters", { subject, semester, unit, lesson });
        return;
    }

    try {
        // Retrieve the original questions for the lesson
        const originalQuestions = getQuestions(subject, semester, unit, lesson);

        showQuizView(); // Show the quiz view area *before* trying to populate it

        if (originalQuestions?.length > 0) {
            // Start the quiz if questions are found
            startQuiz(subject, semester, unit, lesson, originalQuestions);
        } else {
            // Show a specific error message if no questions were found
            console.warn(`No questions found for: ${subject}, ${semester}, ${unit}, ${lesson}`);
            showError(subject, unit, lesson); // Use default 'no questions' message
        }
    } catch (e) {
        // Catch any errors during question retrieval or starting the quiz
        console.error("Error handling section click:", e);
        const strings = getStrings();
        showError(subject, unit, lesson, strings.defaultErrorMessage || "Error loading quiz."); // Show generic error
    }
}

function startQuiz(subject, semester, unit, lesson, originalQuestions) {
    // Shuffle questions for the quiz session
    const shuffledQuestions = shuffleArray(originalQuestions);

    // Reset state completely before starting
     quizState = {
        currentQuestionIndex: 0,
        correctAnswers: 0,
        totalQuestions: shuffledQuestions.length,
        startTime: new Date(), // Record start time
        endTime: null,
        selectedAnswers: new Array(shuffledQuestions.length).fill(null), // Initialize answers array
        questions: shuffledQuestions, // Use shuffled questions for the quiz
        originalQuestions: originalQuestions, // Keep original order for potential review/redo
        subject: subject,
        unit: unit,
        lesson: lesson,
        semester: semester,
        matchingState: { selectedPromptElement: null, selectedMatchElement: null, userPairs: {}, sortableInstances: [] } // Reset matching
    };

    // Set RTL layout based on the quiz subject
    const isRTL = RTL_SUBJECTS.includes(subject);
    setRtlLayout(isRTL);

    // Update quiz title
    if (quizTitleElement) {
        const strings = getStrings();
        quizTitleElement.textContent = `${strings.quizTitlePrefix || 'Quiz'}: ${lesson}`;
    }

    // Display the first question
    displayQuestion();
}


function displayQuestion() {
    // Ensure required elements exist
    if (!quizContainerElement || !feedbackContainerElement || !quizButtonsContainerElement) {
        console.error("displayQuestion: Critical elements missing.");
        return;
    }

    const currentQuestion = quizState.questions[quizState.currentQuestionIndex];

    // Handle case where index might be out of bounds (should ideally be caught by nextQuestion)
    if (!currentQuestion) {
        console.warn("DisplayQuestion called but no current question found. Index:", quizState.currentQuestionIndex);
        displayResults(); // Go to results if out of bounds
        return;
    }

    // --- Cleanup from previous question ---
    // Clear containers
    quizContainerElement.innerHTML = '';
    feedbackContainerElement.innerHTML = '';
    feedbackContainerElement.classList.add('hidden');
    quizButtonsContainerElement.innerHTML = '';
     // Cleanup potential leftovers from previous question types (e.g., matching)
    if (matchingArrowObserver) {
        matchingArrowObserver.disconnect();
        matchingArrowObserver = null;
    }
    if (matchingSvgElement && matchingSvgElement.parentNode) {
        matchingSvgElement.remove();
        matchingSvgElement = null;
    }
    // Destroy sortable instances if they were used
    quizState.matchingState?.sortableInstances?.forEach(instance => instance.destroy());
    // Reset matching state specifically
    quizState.matchingState = { selectedPromptElement: null, selectedMatchElement: null, userPairs: {}, sortableInstances: [] };

    // --- Create current question elements ---
    // Wrapper for the entire question display (progress + text + type-specific content)
    const questionDisplayWrapper = document.createElement('div');
    questionDisplayWrapper.className = 'question-display-wrapper';

    // Progress text (e.g., "Q 1/10")
    const progressText = document.createElement('div');
    progressText.className = 'question-progress';
    progressText.textContent = `Q ${quizState.currentQuestionIndex + 1}/${quizState.totalQuestions}`;
    questionDisplayWrapper.appendChild(progressText);

    // Question text
    const questionTextElement = document.createElement('p');
    questionTextElement.className = 'question-text';
    // Use innerHTML for potential formatting in the question string (e.g., <strong>)
    // Add a default '?' if question text is missing
    questionTextElement.innerHTML = `<strong>Q:</strong> ${currentQuestion.question || '?'}`;
    questionDisplayWrapper.appendChild(questionTextElement);

    // Wrapper specifically for the question type's interactive elements (options, matching items, etc.)
    const typeSpecificWrapper = document.createElement('div');
    typeSpecificWrapper.className = 'question-type-wrapper';

    // Render content based on question type
    try {
        switch (currentQuestion.type) {
            case "matching":
                renderMatching(currentQuestion, typeSpecificWrapper);
                // Use requestAnimationFrame to ensure elements are in DOM before observing/drawing arrows
                // This helps prevent race conditions where drawing happens before layout is complete.
                requestAnimationFrame(setupArrowObserver);
                break;
            case "ordering":
                renderOrdering(currentQuestion, typeSpecificWrapper);
                break;
            case "multiple_choice":
            default: // Default to multiple choice if type is missing or unknown
                renderMultipleChoice(currentQuestion, typeSpecificWrapper);
                break;
        }
    } catch (e) {
        console.error("Error rendering question type", currentQuestion.type, e);
        // Display an error message within the question area
        typeSpecificWrapper.innerHTML = `<p style="color:red;">Error displaying this question's content.</p>`;
    }

    // Append the type-specific content to the main display wrapper
    questionDisplayWrapper.appendChild(typeSpecificWrapper);
    // Append the whole question display to the main quiz container
    quizContainerElement.appendChild(questionDisplayWrapper);

    // --- Add Action Buttons ---
    // Submit Button
    const submitButton = document.createElement('button');
    submitButton.className = 'btn submit-btn';
    submitButton.id = 'submit-btn';
    submitButton.innerHTML = `<span class="btn-text"></span>`; // Text set by updateUiLanguage
    submitButton.onclick = checkAnswer; // Link to the check answer function

    // Next/View Results Button (initially hidden)
    const nextButton = document.createElement('button');
    nextButton.className = 'btn next-btn hidden'; // Start hidden
    nextButton.id = 'next-btn';
    nextButton.innerHTML = `<span class="btn-text"></span>`; // Text set by updateUiLanguage
    nextButton.onclick = nextQuestion; // Link to the next question function

    // Append buttons to their container
    quizButtonsContainerElement.append(submitButton, nextButton);

    // --- Initial Button State ---
    // Disable submit button initially for types requiring interaction
    // It will be enabled by interaction handlers (e.g., selecting an option, completing matching)
    if (currentQuestion.type === 'multiple_choice' || currentQuestion.type === 'ordering' || currentQuestion.type === 'matching') {
        submitButton.disabled = true;
    } else {
        // Enable for potentially simpler or unknown types that might not have specific interaction handlers
        submitButton.disabled = false;
    }

    // Ensure all UI text (including button labels) is updated for the current language
    updateUiLanguage(getCurrentLang());
}


// --- Rendering Functions ---

function renderMultipleChoice(question, container) {
    // Basic validation
    if (!question.options || !Array.isArray(question.options) || question.options.length === 0) {
        container.textContent = 'Error: No options provided for multiple choice question.';
        console.error("MC Render Error: No options.", question);
        return;
    }

    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'options-container';

    // Create label/input for each option
    question.options.forEach((optionText, index) => {
        const optionId = `option-${index}`; // Unique ID for the input

        const label = document.createElement('label');
        label.className = 'option-label';
        label.htmlFor = optionId; // Associate label with input

        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'question-option'; // Group radio buttons
        input.value = index; // Store the index as the value
        input.id = optionId;
        input.className = 'option-input';

        // Add event listener to enable submit button on selection
        input.addEventListener('change', () => {
            const submitBtn = document.getElementById('submit-btn');
            if (submitBtn) submitBtn.disabled = false;
        });

        const textSpan = document.createElement('span');
        textSpan.className = 'option-text';
        textSpan.textContent = optionText; // Display the option text

        // Append input and text to label, then label to container
        label.append(input, textSpan);
        optionsContainer.appendChild(label);
    });

    // Add the options container to the main question container
    container.appendChild(optionsContainer);
}

function renderMatching(question, container) {
     // Validate data structure
     if (!question.prompts?.length || !question.matches?.length || question.prompts.length !== question.matches.length) {
         container.textContent = 'Error: Matching question data is invalid (missing prompts, matches, or lengths mismatch).';
         console.error("Matching Render Error: Invalid data.", question);
         return;
     }

     const strings = getStrings();
     // Reset internal state for this specific matching question
     quizState.matchingState.userPairs = {};
     quizState.matchingState.selectedPromptElement = null;
     quizState.matchingState.selectedMatchElement = null;

     // Instructions
     const instructions = document.createElement('p');
     instructions.className = 'matching-instructions';
     instructions.textContent = strings.matchingInstruction || ''; // Get text from strings
     container.appendChild(instructions);

     // Outer container for relative positioning of SVG arrows
     const outerWrapper = document.createElement('div');
     outerWrapper.style.position = 'relative'; // Essential for absolute positioning of SVG
     outerWrapper.id = `matching-outer-${quizState.currentQuestionIndex}`; // Unique ID if needed
     container.appendChild(outerWrapper);

     // SVG Element for drawing arrows
     // Create SVG element dynamically
     matchingSvgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
     matchingSvgElement.id = 'matching-arrow-svg';
     // Define arrowhead marker within SVG
     matchingSvgElement.innerHTML = `
         <defs>
             <marker id="arrowhead" markerWidth="10" markerHeight="7"
                     refX="0" refY="3.5" orient="auto" markerUnits="strokeWidth">
                 <polygon points="0 0, 10 3.5, 0 7" fill="var(--accent-color)" />
             </marker>
         </defs>
     `;
     outerWrapper.appendChild(matchingSvgElement); // Add SVG to the outer wrapper

     // Main container for the two columns (prompts and matches)
     const columnsContainer = document.createElement('div');
     columnsContainer.className = 'matching-container';
     columnsContainer.id = 'matching-cols'; // ID for MutationObserver target

     // Prompt Column (Left in LTR, Right in RTL)
     const promptsColumn = document.createElement('div');
     promptsColumn.className = 'matching-column';
     promptsColumn.id = 'prompts-column';
     promptsColumn.innerHTML = `<h4>${strings.matchingItemsHeader || 'Items'}</h4>`; // Column title

     // Match Column (Right in LTR, Left in RTL)
     const matchesColumn = document.createElement('div');
     matchesColumn.className = 'matching-column';
     matchesColumn.id = 'matches-column';
     matchesColumn.innerHTML = `<h4>${strings.matchingMatchesHeader || 'Matches'}</h4>`; // Column title

     // Shuffle the 'matches' array for display to make it a challenge
     const shuffledMatches = question.matches
        .map((text, originalIndex) => ({ text, originalIndex })) // Keep track of original index
        .sort(() => 0.5 - Math.random()); // Simple shuffle

     // Create and add prompt items
     question.prompts.forEach((promptText, promptIndex) => {
         const item = document.createElement('div');
         item.className = 'matching-item prompt-item';
         item.textContent = promptText;
         item.dataset.index = promptIndex; // Store original index
         item.id = `prompt-${promptIndex}`; // Unique ID
         item.onclick = handleMatchingClick; // Attach click handler
         // item.tabIndex = 0; // Make focusable if keyboard nav needed
         // item.onkeydown = handleMatchingKeydown; // Add if keyboard nav is needed
         promptsColumn.appendChild(item);
     });

     // Create and add shuffled match items
     shuffledMatches.forEach(matchObject => {
         const item = document.createElement('div');
         item.className = 'matching-item match-item';
         item.textContent = matchObject.text;
         item.dataset.index = matchObject.originalIndex; // Store original index
         item.id = `match-${matchObject.originalIndex}`; // Unique ID using original index
         item.onclick = handleMatchingClick; // Attach click handler
         // item.tabIndex = 0; // Make focusable if keyboard nav needed
         // item.onkeydown = handleMatchingKeydown; // Add if keyboard nav is needed
         matchesColumn.appendChild(item);
     });

     // Append columns to their container, and container to the outer wrapper
     columnsContainer.append(promptsColumn, matchesColumn);
     outerWrapper.appendChild(columnsContainer);
}


function renderOrdering(question, container) {
    // Validate data
    if (!question.items || !Array.isArray(question.items) || question.items.length === 0) {
        container.textContent = 'Error: Ordering question data is invalid or empty.';
        console.error("Ordering Render Error: Invalid data.", question);
        return;
    }

    const strings = getStrings();
    const numItems = question.items.length;

    // Instructions
    const instructions = document.createElement('p');
    instructions.className = 'ordering-instructions';
    const instructionTemplate = strings.orderingInstruction || '';
    // Replace placeholder with actual range, handle singular case
    instructions.textContent = numItems > 0
        ? instructionTemplate.replace('{num}', numItems > 1 ? `1-${numItems}` : '1')
        : instructionTemplate.replace('{num}', 'N/A');
    container.appendChild(instructions);

    // Container for the ordering items
    const orderingContainer = document.createElement('div');
    orderingContainer.className = 'ordering-container';
    orderingContainer.id = 'ordering-list'; // Useful for targeting selects

    // Function to check if all dropdowns have a selection (to enable submit)
    const checkCompletion = () => {
        const allSelects = orderingContainer.querySelectorAll('.ordering-select');
        // Check if *every* select has a value that is not the empty placeholder ""
        const allSelected = Array.from(allSelects).every(select => select.value !== "");
        const submitBtn = document.getElementById('submit-btn');
        if (submitBtn) submitBtn.disabled = !allSelected; // Enable only if all are selected
    };

    // Shuffle items for display to prevent revealing the order
    const shuffledItems = question.items
        .map((text, originalIndex) => ({ text, originalIndex })) // Keep original index
        .sort(() => 0.5 - Math.random()); // Simple shuffle

    // Create item elements (select + text)
    shuffledItems.forEach(({ text: itemText, originalIndex }) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'ordering-item';
        // Store original index if needed for answer checking logic later
        itemDiv.dataset.originalIndex = originalIndex;

        const select = document.createElement('select');
        select.className = 'ordering-select';
        // Link the select to the original item index for easy mapping during answer check
        select.dataset.itemIndex = originalIndex;

        // Add a default, disabled placeholder option
        const defaultOption = document.createElement('option');
        defaultOption.value = ""; // Empty value signifies no selection
        defaultOption.textContent = "-"; // Placeholder text
        defaultOption.selected = true;
        defaultOption.disabled = true; // Make it unselectable after choosing something else
        select.appendChild(defaultOption);

        // Populate the select with order numbers (1 to numItems)
        for (let i = 1; i <= numItems; i++) {
            const option = document.createElement('option');
            option.value = i; // Value is the order number
            option.textContent = i; // Text is the order number
            select.appendChild(option);
        }

        // Add event listener to check completion state whenever a selection changes
        select.addEventListener('change', checkCompletion);

        const textSpan = document.createElement('span');
        textSpan.className = 'ordering-text';
        textSpan.textContent = itemText; // Display the item text

        // Append select and text to the item div, then item div to the container
        itemDiv.append(select, textSpan);
        orderingContainer.appendChild(itemDiv);
    });

    // Add the container with all items to the main question container
    container.appendChild(orderingContainer);
}


// --- Interaction Handlers ---

function handleMatchingClick(event) {
    const clickedItem = event.target.closest('.matching-item');
    // Ignore clicks if item is disabled (e.g., after submitting) or not a matching item
    if (!clickedItem || clickedItem.disabled || clickedItem.classList.contains('disabled')) return;

    const isRTL = mainContainerElement.classList.contains('rtl-layout');
    const isPrompt = clickedItem.classList.contains('prompt-item');
    const isMatch = clickedItem.classList.contains('match-item');
    const isAlreadyMatched = clickedItem.classList.contains('matched');
    const clickedIndex = clickedItem.dataset.index; // Get the original index

    // --- Case 1: Clicked a Matched Item (to unmatch the pair) ---
    if (isAlreadyMatched) {
        let promptIndexToClear = -1;
        let matchIndexToClear = -1;

        // Find the indices of the pair to unmatch
        if (isPrompt) {
            // Clicked on the prompt side of a matched pair
            promptIndexToClear = clickedIndex;
            matchIndexToClear = quizState.matchingState.userPairs[promptIndexToClear];
        } else {
            // Clicked on the match side of a matched pair
            matchIndexToClear = clickedIndex;
            // Find the prompt index that maps to this match index in the userPairs state
            promptIndexToClear = Object.keys(quizState.matchingState.userPairs).find(
                pIdx => quizState.matchingState.userPairs[pIdx] == matchIndexToClear // Use == for safety (string/number)
            );
        }

        // If we successfully identified the pair
        if (promptIndexToClear != -1 && matchIndexToClear !== undefined && promptIndexToClear !== undefined) {
            const promptElement = document.getElementById(`prompt-${promptIndexToClear}`);
            const matchElement = document.getElementById(`match-${matchIndexToClear}`);

            // Remove visual 'matched' and 'selected' states
            if (promptElement) promptElement.classList.remove('matched', 'selected');
            if (matchElement) matchElement.classList.remove('matched', 'selected');

            // Remove the pair from the state
            delete quizState.matchingState.userPairs[promptIndexToClear];
            // Remove the visual arrow
            removeArrow(promptIndexToClear);

            // Reset selection state (nothing should be selected after unmatching)
            quizState.matchingState.selectedPromptElement = null;
            quizState.matchingState.selectedMatchElement = null;

            // Disable submit button as the match is now incomplete
            const submitBtn = document.getElementById('submit-btn');
            if (submitBtn) submitBtn.disabled = true;
        }
        return; // Stop further processing after unmatching
    }

    // --- Case 2: Clicked an Unmatched Item ---
    const currentSelectedPrompt = quizState.matchingState.selectedPromptElement;
    const currentSelectedMatch = quizState.matchingState.selectedMatchElement;

    // --- RTL Logic (Select Match first, then Prompt) ---
    if (isRTL) {
        if (isMatch) { // Clicked a potential 'match' item (on the left in RTL)
            if (clickedItem === currentSelectedMatch) {
                // Clicked the same selected match item again: Deselect it
                clickedItem.classList.remove('selected');
                quizState.matchingState.selectedMatchElement = null;
            } else {
                // Clicked a new match item
                // Deselect any previously selected match item
                if (currentSelectedMatch) currentSelectedMatch.classList.remove('selected');
                // Select the new one
                clickedItem.classList.add('selected');
                quizState.matchingState.selectedMatchElement = clickedItem;
                // If a prompt was selected on the other side, deselect it (only one side active)
                if (currentSelectedPrompt) {
                    currentSelectedPrompt.classList.remove('selected');
                    quizState.matchingState.selectedPromptElement = null;
                }
            }
        } else if (isPrompt && currentSelectedMatch) { // Clicked a 'prompt' item WHILE a 'match' is selected: Create Pair
            const matchIndex = currentSelectedMatch.dataset.index;
            const promptIndex = clickedIndex;

            // Store the pair { promptIndex: matchIndex }
            quizState.matchingState.userPairs[promptIndex] = parseInt(matchIndex, 10);

            // Update visual state: mark both as matched, remove 'selected' from match
            currentSelectedMatch.classList.remove('selected');
            currentSelectedMatch.classList.add('matched');
            clickedItem.classList.add('matched'); // Mark prompt as matched too

            // Draw the arrow (origin is prompt, destination is match, regardless of RTL for drawing logic)
            drawArrow(clickedItem, currentSelectedMatch, promptIndex);

            // Reset selection state (match is now part of a pair)
            quizState.matchingState.selectedMatchElement = null;

            // Check if all prompts are now matched to enable submit button
            const totalPrompts = document.querySelectorAll('.prompt-item').length;
            const matchedCount = Object.keys(quizState.matchingState.userPairs).length;
            const submitBtn = document.getElementById('submit-btn');
            if (submitBtn && totalPrompts > 0 && totalPrompts === matchedCount) {
                submitBtn.disabled = false;
            }
        }
        // Ignore clicks on prompt items if no match item is selected in RTL
    }
    // --- LTR Logic (Select Prompt first, then Match) - Default ---
    else {
        if (isPrompt) { // Clicked a potential 'prompt' item (on the left in LTR)
             if (clickedItem === currentSelectedPrompt) {
                 // Clicked the same selected prompt item again: Deselect it
                 clickedItem.classList.remove('selected');
                 quizState.matchingState.selectedPromptElement = null;
             } else {
                 // Clicked a new prompt item
                 // Deselect any previously selected prompt item
                 if (currentSelectedPrompt) currentSelectedPrompt.classList.remove('selected');
                 // Select the new one
                 clickedItem.classList.add('selected');
                 quizState.matchingState.selectedPromptElement = clickedItem;
                 // If a match was selected on the other side, deselect it
                 if (currentSelectedMatch) {
                     currentSelectedMatch.classList.remove('selected');
                     quizState.matchingState.selectedMatchElement = null;
                 }
             }
        } else if (isMatch && currentSelectedPrompt) { // Clicked a 'match' item WHILE a 'prompt' is selected: Create Pair
             const promptIndex = currentSelectedPrompt.dataset.index;
             const matchIndex = clickedIndex;

             // Store the pair { promptIndex: matchIndex }
             quizState.matchingState.userPairs[promptIndex] = parseInt(matchIndex, 10);

             // Update visual state: mark both as matched, remove 'selected' from prompt
             currentSelectedPrompt.classList.remove('selected');
             currentSelectedPrompt.classList.add('matched');
             clickedItem.classList.add('matched'); // Mark match as matched too

             // Draw the arrow (origin prompt, destination match)
             drawArrow(currentSelectedPrompt, clickedItem, promptIndex);

             // Reset selection state (prompt is now part of a pair)
             quizState.matchingState.selectedPromptElement = null;

             // Check if all prompts are now matched to enable submit button
             const totalPrompts = document.querySelectorAll('.prompt-item').length;
             const matchedCount = Object.keys(quizState.matchingState.userPairs).length;
             const submitBtn = document.getElementById('submit-btn');
             if (submitBtn && totalPrompts > 0 && totalPrompts === matchedCount) {
                 submitBtn.disabled = false;
             }
        }
        // Ignore clicks on match items if no prompt item is selected in LTR
    }
}


// --- Arrow Drawing ---

function drawArrow(promptElement, matchElement, promptIndex) {
    // Get the SVG container (should have been created in renderMatching)
    const svgContainer = matchingSvgElement; // Use the global variable
    const outerDiv = document.getElementById(`matching-outer-${quizState.currentQuestionIndex}`);

    // Ensure all required elements exist
    if (!svgContainer || !promptElement || !matchElement || !outerDiv) {
        console.warn("drawArrow: Missing required elements (SVG, prompt, match, or outer div). Prompt:", promptElement?.id, "Match:", matchElement?.id, "Index:", promptIndex);
        return;
    }

    try {
        const svgRect = svgContainer.getBoundingClientRect();
        const promptRect = promptElement.getBoundingClientRect();
        const matchRect = matchElement.getBoundingClientRect();
        const isRTL = mainContainerElement.classList.contains('rtl-layout');

        let startX, startY, endX, endY;

        // Calculate midpoints relative to the SVG container's top-left corner
        const promptMidY = promptRect.top + promptRect.height / 2 - svgRect.top;
        const matchMidY  = matchRect.top + matchRect.height / 2 - svgRect.top;

        // Define start/end points based on LTR/RTL layout
        // We always draw logically from prompt side to match side,
        // but the physical start/end coordinates change based on layout.
        if (isRTL) {
            // Start: Right edge of prompt item (which is visually on the right)
            startX = promptRect.right - svgRect.left;
            startY = promptMidY;
            // End: Left edge of match item (which is visually on the left)
            endX   = matchRect.left - svgRect.left;
            endY   = matchMidY;
        } else { // LTR
            // Start: Right edge of prompt item (visually on the left)
            startX = promptRect.right - svgRect.left;
            startY = promptMidY;
            // End: Left edge of match item (visually on the right)
            endX   = matchRect.left - svgRect.left;
            endY   = matchMidY;
        }

        // Safety check for coordinates being valid numbers
        if (isNaN(startX) || isNaN(startY) || isNaN(endX) || isNaN(endY) ||
            !isFinite(startX) || !isFinite(startY) || !isFinite(endX) || !isFinite(endY)) {
            console.error("drawArrow: Invalid coordinates calculated.", { startX, startY, endX, endY, promptIndex, isRTL });
            return; // Don't attempt to draw if coordinates are bad
        }

        // Find existing line or create a new one
        let line = svgContainer.querySelector(`#arrow-${promptIndex}`);
        if (!line) {
            line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.id = `arrow-${promptIndex}`;
            line.style.opacity = '0'; // Start invisible for fade-in effect
            svgContainer.appendChild(line); // Append to SVG
        }

        // Set line attributes (position, style, marker)
        line.setAttribute('x1', startX);
        line.setAttribute('y1', startY);
        line.setAttribute('x2', endX);
        line.setAttribute('y2', endY);
        line.setAttribute('stroke', 'var(--accent-color)'); // Use CSS variable for color
        line.setAttribute('stroke-width', '2');
        line.setAttribute('marker-end', 'url(#arrowhead)'); // Attach the arrowhead marker

        // Use requestAnimationFrame for smooth fade-in after attributes are set
        requestAnimationFrame(() => {
            line.style.opacity = '1';
        });

    } catch (e) {
        console.error("Error during drawArrow:", e, { promptIndex });
    }
}


function removeArrow(promptIndex) {
    const svgContainer = matchingSvgElement;
    if (!svgContainer) return; // No SVG, nothing to remove

    const line = svgContainer.querySelector(`#arrow-${promptIndex}`);
    if (line) {
        line.style.opacity = '0'; // Fade out smoothly
        // Remove the element from the DOM after the transition completes
        setTimeout(() => {
             if (line.parentNode) { // Check if it still exists before removing
                 line.remove();
             }
        }, 300); // Match the transition duration (adjust if CSS changes)
    }
}

function updateAllArrowPositions() {
    // Check if we are currently in a matching question context
    const isMatchingQuestion = quizState?.questions?.[quizState.currentQuestionIndex]?.type === 'matching';
    const svgExists = !!matchingSvgElement; // Check if SVG element is currently defined

    if (!isMatchingQuestion || !svgExists) {
        // console.log("Not updating arrows: Not a matching question or SVG missing."); // Debug
        return; // Only run if relevant
    }

    const userPairs = quizState.matchingState.userPairs;
    // console.log("Updating arrow positions for pairs:", userPairs); // Debug

    // Iterate through all currently matched pairs in the state
    for (const promptIndex in userPairs) {
         if (userPairs.hasOwnProperty(promptIndex)) {
             const matchIndex = userPairs[promptIndex];
             // Find the corresponding DOM elements
             const promptElement = document.getElementById(`prompt-${promptIndex}`);
             const matchElement = document.getElementById(`match-${matchIndex}`);

             // If both elements still exist, redraw the arrow between them
             if (promptElement && matchElement) {
                 drawArrow(promptElement, matchElement, promptIndex); // Redraw using current positions
             } else {
                 // If elements are missing (e.g., due to unexpected DOM change), remove the arrow
                  console.warn(`Elements for pair ${promptIndex}-${matchIndex} not found. Removing arrow.`);
                 removeArrow(promptIndex);
             }
         }
    }
}


function setupArrowObserver() {
    const targetNode = document.getElementById('matching-cols'); // Observe the container of the columns

    // Ensure the target node and the SVG element exist before setting up the observer
    if (!targetNode || !matchingSvgElement) {
         console.warn("MutationObserver setup failed: Target 'matching-cols' or SVG element missing.");
         return;
    }

    // Disconnect any previous observer instance to prevent duplicates
    if (matchingArrowObserver) {
        matchingArrowObserver.disconnect();
        // console.log("Disconnected previous observer."); // Debug
    }

    // Configuration for the observer:
    // Watch for changes that might affect layout (attributes, child list changes, subtree mutations)
    const config = {
        attributes: true, // e.g., class changes
        childList: true,  // e.g., items added/removed (less likely here)
        subtree: true,    // Watch descendants for changes
        characterData: false // Don't need to watch text content changes for layout
    };

    // Callback function to execute when mutations are observed
    // Use debounce to limit how often updateAllArrowPositions runs during rapid changes (like resize)
    const callback = debounce(updateAllArrowPositions, 50); // Adjust debounce delay as needed (e.g., 50-100ms)

    // Create a new observer instance linked to the callback function
    matchingArrowObserver = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    matchingArrowObserver.observe(targetNode, config);
    // console.log("MutationObserver started on #matching-cols."); // Debug

    // Also observe the main quiz container for broader layout changes (e.g., class changes affecting width/RTL)
    const quizContainerTarget = document.getElementById('quiz-container');
    if (quizContainerTarget) {
         // Only watch attributes (like class) on the container itself, not its entire subtree again
         matchingArrowObserver.observe(quizContainerTarget, { attributes: true, subtree: false });
         // console.log("MutationObserver also watching #quiz-container attributes."); // Debug
    }

    // Initial call to position arrows correctly after the elements are first rendered and observer is set up.
    // Use a small timeout to ensure the browser has completed initial layout calculations.
    setTimeout(updateAllArrowPositions, 100);
}



// --- Answer Checking ---

function checkAnswer() {
    // Ensure feedback and button containers exist
    if (!feedbackContainerElement || !quizButtonsContainerElement) {
        console.error("checkAnswer: Feedback or button container missing.");
        return;
    }

    // Disconnect the MutationObserver for matching arrows *before* potentially modifying styles
    if (matchingArrowObserver) {
        matchingArrowObserver.disconnect();
        matchingArrowObserver = null; // Clear the observer variable
        // console.log("Matching observer disconnected for answer check."); // Debug
    }

    const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
    // Initialize result object
    let result = {
        isCorrect: false,
        feedback: '',
        userResponse: null, // Store what the user actually selected/did
        scoreIncrement: 0   // How much to add to the score (usually 0 or 1)
    };
    const strings = getStrings(); // Get current language strings for feedback

    // --- Determine correctness based on question type ---
    try {
        switch (currentQuestion.type) {
            case "matching":
                result = checkMatching(currentQuestion);
                break;
            case "ordering":
                result = checkOrdering(currentQuestion);
                break;
            case "multiple_choice":
            default: // Default to MC
                result = checkMultipleChoice(currentQuestion);
                break;
        }
    } catch (e) {
        console.error("Error checking answer for question type:", currentQuestion.type, e);
        // Provide generic error feedback if checking logic fails
        result = {
            isCorrect: false,
            feedback: `<div class="incorrect-feedback">${strings.defaultErrorMessage || 'Error checking answer.'}</div>`,
            userResponse: null,
            scoreIncrement: 0
        };
    }

    // --- Store user's response and update score ---
    quizState.selectedAnswers[quizState.currentQuestionIndex] = result.userResponse;
    quizState.correctAnswers += result.scoreIncrement; // Add score increment (0 or 1)

    // --- Display Feedback ---
    feedbackContainerElement.innerHTML = result.feedback; // Assumes feedback includes explanation HTML
    feedbackContainerElement.classList.remove('hidden'); // Make feedback visible

    // --- Disable Inputs ---
    disableInputs(); // Prevent further changes after submission

    // --- Update Buttons ---
    const submitBtn = quizButtonsContainerElement.querySelector('#submit-btn');
    const nextBtn = quizButtonsContainerElement.querySelector('#next-btn');

    if (submitBtn) submitBtn.classList.add('hidden'); // Hide Submit button

    if (nextBtn) {
        // Determine text for the "Next" button (Next Question or View Results)
        const isLastQuestion = quizState.currentQuestionIndex === quizState.totalQuestions - 1;
        const nextBtnTextKey = (isLastQuestion && quizState.totalQuestions > 0) ? 'viewResults' : 'next';

        // Update button text using the text span inside
        const textSpan = nextBtn.querySelector('.btn-text');
        if (textSpan) textSpan.textContent = strings[nextBtnTextKey] || nextBtnTextKey; // Use fallback if string missing

        nextBtn.classList.remove('hidden'); // Show the Next/Results button
    }
}

function checkMultipleChoice(question) {
    const selectedRadio = document.querySelector('input[name="question-option"]:checked');
    const strings = getStrings();

    // Handle case where nothing is selected
    if (!selectedRadio) {
        return {
            isCorrect: false,
            feedback: `<div class="incorrect-feedback">${strings.selectAnswerPrompt || 'Please select an answer.'}</div>`,
            userResponse: null, // No response
            scoreIncrement: 0
        };
    }

    const selectedIndex = parseInt(selectedRadio.value, 10);
    const correctAnswerText = question.answer; // The correct answer string
    const selectedAnswerText = question.options?.[selectedIndex]; // The text of the selected option
    const isCorrect = selectedAnswerText === correctAnswerText;

    // Apply visual feedback to option labels
    document.querySelectorAll('.option-label').forEach((label, index) => {
        const input = label.querySelector('input');
        // Highlight the correct answer(s)
        if (question.options?.[index] === correctAnswerText) {
            label.classList.add('correct-option');
        }
        // If this option was selected and it's incorrect, mark it as incorrect
        if (input && input.checked && !isCorrect) {
            label.classList.add('incorrect-option');
        }
        // Ensure labels are not clickable anymore (handled by disableInputs)
    });

    // Generate primary feedback HTML (Correct or Incorrect + Correct Answer)
    let feedbackHtml = isCorrect
        ? `<div class="correct-feedback">${strings.correctFeedback || 'Correct! ✓'}</div>`
        : `<div class="incorrect-feedback">${strings.incorrectFeedback || 'Incorrect.'} <span>${strings.correctAnswerIs || 'Correct answer:'} ${correctAnswerText || 'N/A'}</span></div>`;

    // Append explanation if it exists
    if (question.explanation) {
        // Basic check for RTL characters to potentially add dir="ltr" if mostly non-RTL
        const dirAttr = /[\u0600-\u06FF]/.test(question.explanation) ? '' : ' dir="ltr"';
        feedbackHtml += `<div class="feedback-explanation"${dirAttr}>${question.explanation}</div>`;
    }

    return {
        isCorrect: isCorrect,
        feedback: feedbackHtml,
        userResponse: selectedIndex, // Store the index the user selected
        scoreIncrement: isCorrect ? 1 : 0 // Increment score if correct
    };
}

function checkMatching(question) {
    const userPairs = quizState.matchingState.userPairs || {}; // User's { promptIdx: matchIdx }
    const correctPairs = question.answer || {}; // Correct { promptIdx: matchIdx }
    const totalCorrectPairs = Object.keys(correctPairs).length;
    let correctlyMatchedCount = 0;
    const strings = getStrings();

    // Handle case with no correct pairs defined (unlikely for matching, but safe)
    if (totalCorrectPairs === 0) {
        return {
            isCorrect: true, // Considered correct if nothing needed matching
            feedback: `<div class="correct-feedback">${strings.matchingNoMatchNeeded || 'No matching needed.'}</div>`,
            userResponse: userPairs,
            scoreIncrement: 0 // No points awarded/deducted
        };
    }

    // Count how many pairs the user matched correctly
    for (const promptIndex in correctPairs) {
        // Use == for safety comparing potentially string keys/indices with number values
        if (userPairs.hasOwnProperty(promptIndex) && userPairs[promptIndex] == correctPairs[promptIndex]) {
            correctlyMatchedCount++;
        }
    }

    // Determine overall status (Fully Correct, Partially Correct, Incorrect)
    const isFullyCorrect = correctlyMatchedCount === totalCorrectPairs && Object.keys(userPairs).length === totalCorrectPairs;
    const isPartiallyCorrect = correctlyMatchedCount > 0 && !isFullyCorrect;

    // --- Generate Feedback Message ---
    let feedbackHtml = "";
    if (isFullyCorrect) {
        feedbackHtml = `<div class="correct-feedback">${strings.matchingAllCorrect || 'Correct! ✓ All matched.'}</div>`;
    } else if (isPartiallyCorrect) {
        const partialMsg = (strings.matchingPartialCorrect || 'Partial correct: {correct}/{total}.')
            .replace('{correct}', correctlyMatchedCount)
            .replace('{total}', totalCorrectPairs);
        feedbackHtml = `<div class="partial-feedback">${partialMsg}</div>`;
    } else { // Incorrect (0 correct pairs matched)
         const noneMsg = (strings.matchingNoneCorrect || 'Incorrect: 0/{total} matched.')
            .replace('{total}', totalCorrectPairs);
        feedbackHtml = `<div class="incorrect-feedback">${noneMsg}</div>`;
    }

    // --- Apply Visual Feedback to Arrows and Items ---
    // Iterate through the pairs the *user* attempted to match
    for (const userPromptIndex in userPairs) {
        if (userPairs.hasOwnProperty(userPromptIndex)) {
            const userMatchIndex = userPairs[userPromptIndex];
            const correctMatchIndex = correctPairs[userPromptIndex]; // Get the correct match for this prompt
            const isThisPairCorrect = correctMatchIndex !== undefined && userMatchIndex == correctMatchIndex;

            const line = matchingSvgElement?.querySelector(`#arrow-${userPromptIndex}`);
            const promptEl = document.getElementById(`prompt-${userPromptIndex}`);
            const userMatchEl = document.getElementById(`match-${userMatchIndex}`); // Element user matched with

            if (!line || !promptEl || !userMatchEl) continue; // Skip if elements are missing

            // Change arrow color
            if (isThisPairCorrect) {
                line.style.stroke = 'var(--correct-border)';
                // Also update arrowhead fill color
                line.closest('svg')?.querySelector(`#arrowhead polygon`)?.setAttribute('fill', 'var(--correct-border)');
                // Optionally style the items themselves
                 // promptEl.style.borderColor = 'var(--correct-border)';
                 // userMatchEl.style.borderColor = 'var(--correct-border)';
            } else {
                line.style.stroke = 'var(--incorrect-border)';
                line.closest('svg')?.querySelector(`#arrowhead polygon`)?.setAttribute('fill', 'var(--incorrect-border)');
                 // promptEl.style.borderColor = 'var(--incorrect-border)';
                 // userMatchEl.style.borderColor = 'var(--incorrect-border)';
                 // Optionally: Draw the *correct* arrow faintly? (More complex)
            }
        }
    }
     // Consider highlighting prompts the user *didn't* match if required? (More complex)

    // --- Append Explanation ---
    if (question.explanation) {
        const dirAttr = /[\u0600-\u06FF]/.test(question.explanation) ? '' : ' dir="ltr"';
        feedbackHtml += `<div class="feedback-explanation"${dirAttr}>${question.explanation}</div>`;
    }

    return {
        isCorrect: isFullyCorrect, // Only true if all pairs are correct
        feedback: feedbackHtml,
        userResponse: userPairs, // Store the user's complete set of pairs
        scoreIncrement: isFullyCorrect ? 1 : 0 // Only give points for full correctness
    };
}

function checkOrdering(question) {
    const originalItems = question.items || [];
    const correctAnswerOrder = question.answer || []; // Array of item texts in correct order
    const numItems = originalItems.length;
    const strings = getStrings();

    // --- Basic Validation ---
    if (numItems === 0 || !Array.isArray(correctAnswerOrder) || numItems !== correctAnswerOrder.length) {
        console.error("Invalid ordering question data:", question);
        return { isCorrect: false, feedback: `<div class="incorrect-feedback">${strings.orderingInvalidData || 'Error: Invalid ordering setup.'}</div>`, userResponse: null, scoreIncrement: 0 };
    }

    // --- Get User Input ---
    const userOrderMap = {}; // { originalItemIndex: selectedPosition }
    const selectedPositions = new Set(); // To check for duplicates
    let allSelected = true; // Assume all are selected initially
    let hasDuplicates = false;

    const selectElements = document.querySelectorAll("#ordering-list .ordering-select");

    // Check if the number of select elements matches the expected number of items
    if (selectElements.length !== numItems) {
        console.error("Ordering Error: Select element count mismatch.");
        return { isCorrect: false, feedback: `<div class="incorrect-feedback">${strings.orderingSelectionError || 'Error processing selections.'}</div>`, userResponse: null, scoreIncrement: 0 };
    }

    // Process each select element
    selectElements.forEach(select => {
        const itemIndex = parseInt(select.dataset.itemIndex, 10); // Original index of the item text
        const selectedValue = select.value; // The position (1-based) selected by the user

        if (selectedValue === "") { // Check if a selection was made
            allSelected = false;
        } else {
            const position = parseInt(selectedValue, 10);
            // Validate the selected position number
            if (isNaN(position) || position < 1 || position > numItems) {
                allSelected = false; // Invalid selection treated as not selected
                console.warn(`Invalid position selected: ${selectedValue} for item index ${itemIndex}`);
                return; // Skip processing this invalid selection
            }
            // Store the mapping: original item index -> user-selected position
            userOrderMap[itemIndex] = position;
            // Check for duplicate position selections
            if (selectedPositions.has(position)) {
                hasDuplicates = true;
            }
            selectedPositions.add(position);
        }
    });

    // --- Input Validation Feedback ---
    if (!allSelected) {
        return { isCorrect: false, feedback: `<div class="incorrect-feedback">${strings.orderingSelectAll || 'Please select an order for all items.'}</div>`, userResponse: userOrderMap, scoreIncrement: 0 };
    }
    if (hasDuplicates || selectedPositions.size !== numItems) { // Also check if all numbers 1-N were used
        const numText = numItems > 1
            ? (strings.orderingUseEachNumOncePlural || 'numbers 1-{n}').replace('{n}', numItems)
            : (strings.orderingUseEachNumOnceSingular || 'number 1');
        const duplicateMsg = (strings.orderingDuplicateUse || 'Please use each order {nums} exactly once.').replace('{nums}', numText);
        return { isCorrect: false, feedback: `<div class="incorrect-feedback">${duplicateMsg}</div>`, userResponse: userOrderMap, scoreIncrement: 0 };
    }

    // --- Construct User's Ordered List ---
    // Create an array representing the user's order based on their selections
    const userOrderedItems = new Array(numItems).fill(null);
    let constructionOk = true;
    for (const itemIndexStr in userOrderMap) {
        if (userOrderMap.hasOwnProperty(itemIndexStr)) {
            const itemIndex = parseInt(itemIndexStr, 10); // Original index
            const itemText = originalItems[itemIndex]; // Get the text using original index
            const userPosition = userOrderMap[itemIndex] - 1; // Convert 1-based position to 0-based index

            // Safety checks during construction
            if (itemText === undefined || userPosition < 0 || userPosition >= numItems || userOrderedItems[userPosition] !== null) {
                console.error("Ordering Error: Failed during sequence construction.", { itemIndex, itemText, userPosition });
                constructionOk = false;
                break;
            }
            userOrderedItems[userPosition] = itemText; // Place the text at the user-chosen position
        }
    }
    // Final check if construction failed or resulted in an incomplete list
    if (!constructionOk || userOrderedItems.some(item => item === null)) {
        console.error("Ordering Error: Failed to construct valid user sequence.", userOrderMap, userOrderedItems);
        return { isCorrect: false, feedback: `<div class="incorrect-feedback">${strings.orderingSequenceError || 'Error processing sequence.'}</div>`, userResponse: userOrderedItems, scoreIncrement: 0 };
    }

    // --- Compare User Order with Correct Order ---
    // Compare the constructed user array with the correct answer array
    const isCorrect = JSON.stringify(userOrderedItems) === JSON.stringify(correctAnswerOrder);

    // --- Generate Feedback ---
    let feedbackHtml = isCorrect
        ? `<div class="correct-feedback">${strings.correctFeedback || 'Correct! ✓'}</div>`
        : `<div class="incorrect-feedback">${strings.incorrectFeedback || 'Incorrect.'} <span>${strings.correctAnswerIs || 'Correct order:'} ${correctAnswerOrder.join(" → ")}</span></div>`; // Show correct order on failure

    // Append explanation if available
    if (question.explanation) {
        const dirAttr = /[\u0600-\u06FF]/.test(question.explanation) ? '' : ' dir="ltr"';
        feedbackHtml += `<div class="feedback-explanation"${dirAttr}>${question.explanation}</div>`;
    }

    // --- Apply Visual Feedback to Selects ---
    selectElements.forEach(select => {
        const itemIndex = parseInt(select.dataset.itemIndex, 10);
        const itemText = originalItems[itemIndex];
        const userSelectedPosition = userOrderMap[itemIndex]; // User's choice (1-based)
        const correctPosition = correctAnswerOrder.indexOf(itemText) + 1; // Correct position (1-based)

        // Style based on whether the user's selected position matches the correct position
        if (userSelectedPosition === correctPosition) {
            select.style.borderColor = "var(--correct-border)";
            select.style.backgroundColor = "var(--correct-bg)";
        } else {
            select.style.borderColor = "var(--incorrect-border)";
            select.style.backgroundColor = "var(--incorrect-bg)";
        }
        select.style.borderWidth = "2px"; // Make feedback more prominent
    });

    return {
        isCorrect: isCorrect,
        feedback: feedbackHtml,
        // Store the user's ordered array of texts for review purposes
        userResponse: userOrderedItems,
        scoreIncrement: isCorrect ? 1 : 0
    };
}


function disableInputs() {
    // Disable radio buttons and selects
    document.querySelectorAll('input[name="question-option"], .ordering-select')
        .forEach(input => input.disabled = true);

    // Make radio button labels look non-interactive
    document.querySelectorAll('.option-label')
        .forEach(label => label.style.cursor = 'default');

    // Make matching items non-interactive
    document.querySelectorAll('.matching-item')
        .forEach(item => {
            item.style.pointerEvents = 'none'; // Best way to prevent clicks
            item.style.cursor = 'default';
            item.classList.add('disabled'); // Add a class for potential styling
            // item.tabIndex = -1; // Remove from tab order if keyboard nav was added
        });
}


// --- Navigation and Results ---

function nextQuestion() {
    quizState.currentQuestionIndex++; // Move to the next index

    // Check if there are more questions
    if (quizState.currentQuestionIndex < quizState.totalQuestions) {
        displayQuestion(); // Display the next question
    } else {
        // No more questions, quiz finished
        quizState.endTime = new Date(); // Mark the end time
        displayResults(); // Show the results view
    }
}

function displayResults() {
    // Ensure required elements exist
    if (!quizContainerElement || !feedbackContainerElement || !quizButtonsContainerElement || !quizTitleElement) {
        console.error("displayResults: Critical elements missing.");
        return;
    }

    // Clear previous quiz content (question, feedback)
    quizContainerElement.innerHTML = '';
    feedbackContainerElement.classList.add('hidden'); // Hide feedback area
    quizButtonsContainerElement.innerHTML = ''; // Clear old buttons

    const strings = getStrings(); // Get UI strings for the current language
    quizTitleElement.textContent = strings.viewResults || 'Quiz Results'; // Update page title

    // --- Calculate Results ---
    const timeTakenSeconds = quizState.endTime && quizState.startTime
        ? Math.round((quizState.endTime - quizState.startTime) / 1000)
        : 0;
    const timeFormatted = formatTime(timeTakenSeconds);
    const scorePercentage = quizState.totalQuestions > 0
        ? (quizState.correctAnswers / quizState.totalQuestions) * 100
        : 0;
    const scoreRounded = scorePercentage.toFixed(0); // Round to nearest integer

    // --- Save Stats (if the quiz had questions) ---
    if (quizState.totalQuestions > 0) {
        saveLessonStats(
            quizState.subject,
            quizState.semester,
            quizState.unit,
            quizState.lesson,
            quizState.correctAnswers,
            quizState.totalQuestions,
            timeTakenSeconds
        );
         // Update the display on the topic list in the background immediately
         // This requires updateLessonBoxDisplays to correctly find the active semester
         updateLessonBoxDisplays();
    }

    // --- Determine Result Message ---
    let resultMessageKey = 'quizResultPractice'; // Default
    if (quizState.totalQuestions === 0) resultMessageKey = 'quizResultNoQuestions';
    else if (scorePercentage >= 90) resultMessageKey = 'quizResultExcellent';
    else if (scorePercentage >= 70) resultMessageKey = 'quizResultGreat';
    else if (scorePercentage >= 50) resultMessageKey = 'quizResultGood';
    const resultMessage = strings[resultMessageKey] || ''; // Get message text

    // --- Create Results Display HTML ---
    const resultsDiv = document.createElement('div');
    resultsDiv.className = 'results-container';
    resultsDiv.innerHTML = `
        <h2 class="results-header">${resultMessage}</h2>
        <div class="results-score">
            <div class="score-circle">
                <span class="score-number">${scoreRounded}</span>
                <span class="score-percent-sign">%</span>
            </div>
        </div>
        <div class="results-details">
            <p data-detail-key="subject"><span class="detail-icon">📚</span><strong>${strings.resultsSubjectLabel || 'Subject:'}</strong> <span class="detail-value">${quizState.subject || 'N/A'}</span></p>
            <p data-detail-key="semester"><span class="detail-icon">🗓️</span><strong>${strings.resultsSemesterLabel || 'Semester:'}</strong> <span class="detail-value">${quizState.semester || 'N/A'}</span></p>
            <p data-detail-key="unit"><span class="detail-icon">🔖</span><strong>${strings.resultsUnitLabel || 'Unit:'}</strong> <span class="detail-value">${quizState.unit || 'N/A'}</span></p>
            <p data-detail-key="lesson"><span class="detail-icon">📖</span><strong>${strings.resultsLessonLabel || 'Lesson:'}</strong> <span class="detail-value">${quizState.lesson || 'N/A'}</span></p>
            <p data-detail-key="correct"><span class="detail-icon">✅</span><strong>${strings.resultsCorrectLabel || 'Correct:'}</strong> <span class="detail-value">${quizState.correctAnswers}/${quizState.totalQuestions}</span></p>
            <p data-detail-key="time"><span class="detail-icon">⏱️</span><strong>${strings.resultsTimeLabel || 'Time:'}</strong> <span class="detail-value">${timeFormatted}</span></p>
        </div>
    `;
    quizContainerElement.appendChild(resultsDiv);

    // --- Create Action Buttons ---
    const actionsDiv = document.createElement('div');
    // Apply classes for consistent styling and layout
    actionsDiv.className = 'results-actions quiz-buttons';

    // Redo Button
    const redoButton = document.createElement('button');
    redoButton.className = 'btn redo-btn';
    redoButton.id = 'redo-btn';
    redoButton.innerHTML = `🔄 <span class="btn-text">${strings.redoQuiz || 'Redo Quiz'}</span>`;
    redoButton.onclick = () => {
         // Restart the quiz using the original, unshuffled questions
         startQuiz(quizState.subject, quizState.semester, quizState.unit, quizState.lesson, quizState.originalQuestions);
    };
    actionsDiv.appendChild(redoButton);

    // Review Button (only if there were questions)
    if (quizState.totalQuestions > 0) {
        const reviewButton = document.createElement('button');
        reviewButton.id = 'review-btn';
        reviewButton.className = 'btn review-btn';
        reviewButton.innerHTML = `🧐 <span class="btn-text">${strings.reviewAnswers || 'Review Answers'}</span>`;
        reviewButton.onclick = reviewAnswers; // Go to the review screen
        actionsDiv.appendChild(reviewButton);
    }

    // Back to Topics Button
    const backToTopicsButton = document.createElement('button');
    backToTopicsButton.className = 'btn back-to-topics-btn'; // Common class
    backToTopicsButton.id = 'back-to-topics-btn-results'; // Specific ID for results view
    backToTopicsButton.innerHTML = `<span>⬅️</span> <span class="btn-text">${strings.backToTopics || 'Back to Topics'}</span>`;
    backToTopicsButton.onclick = showTopicList; // Go back to the main topic list
    actionsDiv.appendChild(backToTopicsButton);

    // Add the action buttons to the button container
    quizButtonsContainerElement.appendChild(actionsDiv);
}


// --- Answer Review ---

function reviewAnswers() {
    // Ensure required elements exist
    if (!quizContainerElement || !feedbackContainerElement || !quizButtonsContainerElement || !quizTitleElement) {
         console.error("reviewAnswers: Critical elements missing.");
        return;
    }

    // Clear the results view content
    quizContainerElement.innerHTML = '';
    feedbackContainerElement.classList.add('hidden'); // Ensure feedback area is hidden
    quizButtonsContainerElement.innerHTML = ''; // Clear results buttons

    const strings = getStrings(); // Get UI strings
    // Update the title for the review screen
    quizTitleElement.textContent = `${strings.reviewTitlePrefix || 'Review'}: ${quizState.lesson || ''}`;

    // Create the main container for all review questions
    const reviewContainerDiv = document.createElement('div');
    reviewContainerDiv.className = 'review-container';

    // --- Iterate through each question and its stored answer ---
    quizState.questions.forEach((question, index) => {
        const questionReviewDiv = document.createElement('div');
        const userAnswer = quizState.selectedAnswers[index]; // Get the stored answer/state for this question

        // Determine the status (correct, incorrect, partial) and get class/text
        let { correctnessClass, statusText } = calculateReviewStatus(question, userAnswer);

        // Apply the status class to the main div for this question
        questionReviewDiv.className = `question-review ${correctnessClass}`;

        // Format the question type for display (e.g., "multiple_choice" -> "multiple choice")
        const questionTypeDisplay = (question.type || 'multiple_choice').replace('_', ' ');

        // --- Build Header for the review question ---
        const headerHtml = `
            <div class="review-question-header">
                <span class="review-question-number">Q ${index + 1} (${questionTypeDisplay})</span>
                <span class="review-status">${statusText}</span>
            </div>
            <p class="review-question-text">${question.question || '?'}</p>
            <div class="review-answer-content" id="review-answer-content-${index}">
                <!-- Content specific to question type will be added here -->
            </div>
        `;
        questionReviewDiv.innerHTML = headerHtml;
        reviewContainerDiv.appendChild(questionReviewDiv); // Add this question's review to the main container

        // --- Render the specific review details based on question type ---
        const answerContentArea = questionReviewDiv.querySelector(`#review-answer-content-${index}`);
        if (answerContentArea) {
            try {
                switch (question.type) {
                    case "matching":
                        reviewMatchingReview(question, userAnswer, answerContentArea);
                        break;
                    case "ordering":
                        reviewOrderingReview(question, userAnswer, answerContentArea);
                        break;
                    case "multiple_choice":
                    default:
                        reviewMultipleChoiceReview(question, userAnswer, answerContentArea);
                        break;
                }
            } catch (e) {
                console.error("Error rendering review answer details for Q", index + 1, e);
                // Display an error within the specific question's review area
                answerContentArea.innerHTML = `<p style="color:red">Error displaying review details for this answer.</p>`;
            }
        } else {
            console.warn(`Could not find content area for review question ${index}`);
        }
    });

    // Append the container with all reviewed questions to the main quiz container
    quizContainerElement.appendChild(reviewContainerDiv);

    // --- Add Action Buttons for the review view ---
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'review-actions quiz-buttons'; // Use consistent button container styling

    // Back to Results Button
    const backToResultsButton = document.createElement('button');
    backToResultsButton.className = 'btn back-btn'; // Style as a secondary/back button
    backToResultsButton.id = 'back-btn'; // Specific ID
    backToResultsButton.innerHTML = `<span>←</span> <span class="btn-text">${strings.backToResults || 'Back to Results'}</span>`;
    backToResultsButton.onclick = displayResults; // Go back to the results summary screen
    actionsDiv.appendChild(backToResultsButton);

    // Back to Topics Button
    const backToTopicsButton = document.createElement('button');
    backToTopicsButton.className = 'btn back-to-topics-btn';
    backToTopicsButton.id = 'back-to-topics-btn-review'; // Specific ID for review view
    backToTopicsButton.innerHTML = `<span>⬅️</span> <span class="btn-text">${strings.backToTopics || 'Back to Topics'}</span>`;
    backToTopicsButton.onclick = showTopicList; // Go directly back to the topic list
    actionsDiv.appendChild(backToTopicsButton);

    // Add action buttons to the main button container
    quizButtonsContainerElement.appendChild(actionsDiv);

    // Scroll to the top of the review container for better UX
    quizContainerElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Calculates the overall status (correct/incorrect/partial/unanswered) for a single question in review mode
function calculateReviewStatus(question, userAnswer) {
    let correctnessClass = 'incorrect'; // Default to incorrect
    let statusText = getStrings().reviewStatusIncorrect || '✗ Incorrect';
    let isCorrect = false;
    let isPartial = false;
    const strings = getStrings();

    // Check if question data is valid
    if (!question || !question.type) {
        console.error("Cannot calculate status for invalid question:", question);
        return { correctnessClass: 'incorrect', statusText: 'Error' };
    }

    try {
        switch (question.type) {
            case "matching":
                const correctPairs = question.answer || {};
                const totalCorrectPairs = Object.keys(correctPairs).length;
                let correctlyMatchedCount = 0;

                // Check user answer validity and count correct matches
                if (totalCorrectPairs > 0 && userAnswer && typeof userAnswer === 'object') {
                    for (const promptIndex in correctPairs) {
                        // Use == for safety comparing potential string keys/indices with number values
                        if (userAnswer.hasOwnProperty(promptIndex) && userAnswer[promptIndex] == correctPairs[promptIndex]) {
                            correctlyMatchedCount++;
                        }
                    }
                }

                // Determine status based on counts
                isCorrect = totalCorrectPairs > 0 && correctlyMatchedCount === totalCorrectPairs && Object.keys(userAnswer || {}).length === totalCorrectPairs;
                isPartial = totalCorrectPairs > 0 && correctlyMatchedCount > 0 && !isCorrect;

                if (isCorrect) {
                    correctnessClass = "correct";
                    statusText = strings.reviewStatusCorrect || "✓ Correct";
                } else if (isPartial) {
                    correctnessClass = "partial";
                    statusText = (strings.reviewStatusPartial || "~ Partial ({correct}/{total})")
                        .replace('{correct}', correctlyMatchedCount)
                        .replace('{total}', totalCorrectPairs);
                } else if (userAnswer === null || Object.keys(userAnswer || {}).length === 0 && totalCorrectPairs > 0) {
                    // Unanswered: if pairs existed but user provided none
                    statusText = strings.reviewStatusUnanswered || 'Unanswered';
                    correctnessClass = 'incorrect'; // Treat unanswered as incorrect for styling/scoring consistency
                } // else: remains 'incorrect' (0 correct matches)
                break;

            case "ordering":
                const correctAnswerOrder = question.answer || [];
                // Check if user answer exists, is an array, and matches the correct answer array using JSON string comparison
                isCorrect = userAnswer && Array.isArray(userAnswer) && Array.isArray(correctAnswerOrder) && JSON.stringify(userAnswer) === JSON.stringify(correctAnswerOrder);

                if (userAnswer === null || !Array.isArray(userAnswer)) { // Handle unanswered or invalid answer format
                    statusText = strings.reviewStatusUnanswered || 'Unanswered';
                    correctnessClass = 'incorrect';
                } else if (isCorrect) {
                    correctnessClass = "correct";
                    statusText = strings.reviewStatusCorrect || "✓ Correct";
                } // else: remains 'incorrect'
                break;

            case "multiple_choice":
            default:
                const correctAnswerText = question.answer;
                const userSelectedIndex = userAnswer; // This should be the index stored earlier
                const userAnswerText = (userSelectedIndex !== null && question.options?.[userSelectedIndex] !== undefined)
                    ? question.options[userSelectedIndex]
                    : null; // Get the text of the user's selection

                // Check if the text of the user's selection matches the correct answer text
                isCorrect = userAnswerText !== null && userAnswerText === correctAnswerText;

                if (userSelectedIndex === null) { // User didn't select anything
                    statusText = strings.reviewStatusUnanswered || 'Unanswered';
                    correctnessClass = 'incorrect';
                } else if (isCorrect) {
                    correctnessClass = "correct";
                    statusText = strings.reviewStatusCorrect || "✓ Correct";
                } // else: remains 'incorrect'
                break;
        }
    } catch (e) {
        console.error("Error calculating review status for question:", question, e);
        correctnessClass = 'incorrect';
        statusText = 'Error'; // Indicate an error occurred during status calculation
    }
    return { correctnessClass, statusText };
}

// Renders the review details for a Multiple Choice question
function reviewMultipleChoiceReview(question, userAnswerIndex, container) {
    const strings = getStrings();
    const reviewDiv = document.createElement("div");
    reviewDiv.className = "review-mc-answer"; // Use consistent class

    const correctAnswerText = question.answer || "N/A";
    const userSelectedText = (userAnswerIndex !== null && question.options?.[userAnswerIndex] !== undefined)
        ? question.options[userAnswerIndex]
        : `(${strings.reviewStatusUnanswered || "No answer"})`; // Display indication if unanswered

    const isCorrect = (userAnswerIndex !== null && userSelectedText === correctAnswerText);

    // --- Build HTML for User's Answer ---
    let userAnswerHtml = `<span class="user-answer-text`;
    if (userAnswerIndex === null) {
        userAnswerHtml += `">`; // No specific style class for unanswered text itself
    } else if (isCorrect) {
        userAnswerHtml += ` correct">`; // Class for correct answer styling
    } else {
        userAnswerHtml += ` incorrect">`; // Class for incorrect answer styling (e.g., line-through)
    }
    userAnswerHtml += `${userSelectedText}</span>`;

    let htmlContent = `<p><strong>${strings.resultsYourAnswerLabel || 'Your Answer:'}</strong> ${userAnswerHtml}</p>`;

    // --- Show Correct Answer (if user was incorrect or didn't answer) ---
    if (!isCorrect) {
        htmlContent += `<p><strong>${strings.resultsCorrectAnswerLabel || 'Correct Answer:'}</strong> <span class="correct-answer-text">${correctAnswerText}</span></p>`;
    }

    // --- Add Explanation ---
    if (question.explanation) {
        const dirAttr = /[\u0600-\u06FF]/.test(question.explanation) ? '' : ' dir="ltr"'; // Basic RTL check
        htmlContent += `<div class="feedback-explanation"${dirAttr}>${question.explanation}</div>`;
    }

    // Set the generated HTML and append to the container
    reviewDiv.innerHTML = htmlContent;
    container.appendChild(reviewDiv);
}

// Renders the review details for a Matching question
function reviewMatchingReview(question, userPairs, container) {
    const strings = getStrings();
    const reviewDiv = document.createElement("div");
    reviewDiv.className = "review-matching-answer";

    const correctPairs = question.answer || {}; // Correct { promptIdx: matchIdx }
    const promptsList = question.prompts || [];
    const matchesList = question.matches || [];
    userPairs = userPairs || {}; // Ensure userPairs is an object, even if null/undefined

    // --- Build the Grid Display ---
    // Use two columns to show prompts and the user's/correct matches
    let gridHtml = `<div class="review-matching-grid">`; // Flex container for columns
    let promptsColContent = `<div class="review-matching-column">`; // Start prompts column
    let matchesColContent = `<div class="review-matching-column">`; // Start matches column

    // Add headers if desired (optional)
    // promptsColContent += `<h4>${strings.matchingItemsHeader || 'Items'}</h4>`;
    // matchesColContent += `<h4>${strings.matchingMatchesHeader || 'Matches'}</h4>`;

    promptsList.forEach((promptText, promptIndex) => {
        const userMatchIndex = userPairs[promptIndex]; // User's matched index for this prompt
        const correctMatchIndex = correctPairs[promptIndex]; // Correct index for this prompt
        const isUserAnswerCorrect = (userMatchIndex !== undefined && userMatchIndex == correctMatchIndex); // Use == safety

        // --- Prompt Column Item ---
        // Style based on whether the user's match for this prompt was correct
        const promptDivClass = isUserAnswerCorrect ? "review-matched-pair-correct" : "review-matched-pair-incorrect";
        promptsColContent += `<div class="${promptDivClass}">${promptIndex + 1}. ${promptText}</div>`;

        // --- Match Column Item ---
        // Get text for correct match and user's match
        const correctMatchText = (correctMatchIndex !== undefined && matchesList[correctMatchIndex] !== undefined)
            ? matchesList[correctMatchIndex]
            : "(N/A)"; // Correct answer text
        const userMatchText = (userMatchIndex !== undefined && matchesList[userMatchIndex] !== undefined)
            ? matchesList[userMatchIndex]
            : `(${strings.reviewStatusUnanswered || 'Unanswered'})`; // User's answer text

        let matchDivContent = ''; // HTML for the match item display
        let matchDivClass = '';
        if (isUserAnswerCorrect) {
            // If correct, just show the text
            matchDivContent = userMatchText; // Same as correctMatchText
            matchDivClass = "review-matched-pair-correct";
        } else {
            // If incorrect, show user's answer (struck through) and correct answer
            matchDivContent = `<span style="text-decoration:line-through;">${userMatchText}</span> <span style="font-weight:500;">(${correctMatchText})</span>`;
            matchDivClass = "review-matched-pair-incorrect";
        }
         matchesColContent += `<div class="${matchDivClass}">${matchDivContent}</div>`;
    });

    promptsColContent += `</div>`; // Close prompts column
    matchesColContent += `</div>`; // Close matches column
    gridHtml += promptsColContent + matchesColContent + `</div>`; // Close grid container

    // --- Final HTML Content ---
    let htmlContent = `<p><strong>${strings.matchingMatchesHeader || 'Matches'}:</strong></p>` + gridHtml;

    // Add Explanation
    if (question.explanation) {
        const dirAttr = /[\u0600-\u06FF]/.test(question.explanation) ? '' : ' dir="ltr"';
        htmlContent += `<div class="feedback-explanation"${dirAttr} style="margin-top: 15px;">${question.explanation}</div>`;
    }

    // Set the generated HTML and append to the container
    reviewDiv.innerHTML = htmlContent;
    container.appendChild(reviewDiv);
}

// Renders the review details for an Ordering question
function reviewOrderingReview(question, userOrderedItems, container) {
    const strings = getStrings();
    const reviewDiv = document.createElement("div");
    reviewDiv.className = "review-ordering-answer";

    const correctOrder = question.answer || []; // Correct order array of texts
    userOrderedItems = userOrderedItems || []; // Ensure it's an array, even if null/undefined

    // Header for the section
    let htmlContent = `<p><strong>${(strings.orderingInstruction || 'Order:').split(':')[0]}:</strong></p>`; // Simple header

    // --- Build the Ordered List Display ---
    // Display items in the CORRECT order, indicating the user's placement
    let listHtml = `<div class="review-ordering-list">`; // Container for list items

    correctOrder.forEach((correctItemText, correctIndex) => {
        const itemDiv = document.createElement("div"); // Create div for styling flexibility
        itemDiv.className = "review-ordering-list-item"; // Base class

        const correctPosition = correctIndex + 1; // 1-based correct position
        const userIndex = userOrderedItems.indexOf(correctItemText); // Find where user placed this item
        const userPosition = (userIndex !== -1) ? userIndex + 1 : null; // User's 1-based position, or null if not placed

        let numberSpanHTML = ''; // HTML for the position number(s)
        let itemClassSuffix = ''; // To add style based on correctness

        if (userPosition === correctPosition) {
            // User placed correctly
            numberSpanHTML = `<span class="review-order-number review-order-correct">${correctPosition}.</span>`;
            itemClassSuffix = ' correct'; // Add class for background styling
             itemDiv.style.backgroundColor = 'var(--correct-bg)'; // Direct style example
        } else if (userPosition !== null) {
            // User placed incorrectly
            numberSpanHTML = `<span class="review-order-number review-order-incorrect">${userPosition}.</span> <span class="review-order-number review-order-correct">(${correctPosition}.)</span>`;
            itemClassSuffix = ' incorrect';
             itemDiv.style.backgroundColor = 'var(--incorrect-bg)';
        } else {
            // User did not place this item (shouldn't happen if validation worked, but handle defensively)
            numberSpanHTML = `<span class="review-order-number review-order-incorrect">(${strings.reviewStatusUnanswered || 'NP'})</span> <span class="review-order-number review-order-correct">(${correctPosition}.)</span>`;
            itemClassSuffix = ' unanswered'; // Could style this differently if needed
             itemDiv.style.backgroundColor = 'var(--partial-bg)'; // Example style for unanswered
        }

        // Add the calculated class suffix if needed (optional, if direct styling is preferred)
        // itemDiv.classList.add(`review-ordering-item-${itemClassSuffix.trim()}`);

        // Combine number(s) and item text
        itemDiv.innerHTML = `${numberSpanHTML} ${correctItemText}`;
        listHtml += itemDiv.outerHTML; // Add the item's HTML to the list
    });

     listHtml += `</div>`; // Close list container
    htmlContent += listHtml;

    // --- Add Explanation ---
    if (question.explanation) {
        const dirAttr = /[\u0600-\u06FF]/.test(question.explanation) ? '' : ' dir="ltr"';
        htmlContent += `<div class="feedback-explanation"${dirAttr} style="margin-top: 15px;">${question.explanation}</div>`;
    }

    // Set the generated HTML and append to the container
    reviewDiv.innerHTML = htmlContent;
    container.appendChild(reviewDiv);
}


// --- Error Display ---
function showError(subject, unit, lesson, customMessage = '') {
    // Ensure required elements exist
    if (!quizContainerElement || !feedbackContainerElement || !quizButtonsContainerElement || !quizTitleElement) {
        console.error("showError: Critical elements missing.");
        return;
    }

    showQuizView(); // Make sure the quiz area is visible

    const strings = getStrings();

    // Set title to indicate an error state
    // Use a generic error title or the specific "Could not load" message
    quizTitleElement.textContent = (customMessage && customMessage.includes("load"))
        ? strings.defaultErrorMessage // Use the standard loading error message
        : 'Error'; // Generic error title

    // Clear previous content (question, feedback, buttons)
    quizContainerElement.innerHTML = '';
    feedbackContainerElement.classList.add('hidden');
    quizButtonsContainerElement.innerHTML = '';

    // Prepare the error message to display
    // Use custom message if provided, otherwise create a default message
    const defaultMsg = (strings.defaultErrorMessage || "Could not load questions for \"{lesson}\" in \"{unit}\".")
        .replace('{lesson}', lesson || 'N/A')
        .replace('{unit}', unit || 'N/A');
    const displayMsg = customMessage || defaultMsg;

    // Create the error display elements
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-display'; // Use class for styling
    // Add the message
    errorDiv.innerHTML = `<div class="error-message">${displayMsg}</div>`;

    // Add a "Back to Topics" button within the error display
    const backBtn = document.createElement('button');
    backBtn.className = 'btn back-to-topics-btn'; // Consistent styling
    backBtn.id = 'back-to-topics-btn-error'; // Specific ID for error view
    backBtn.innerHTML = `<span>⬅️</span> <span class="btn-text">${strings.backToTopics || 'Back to Topics'}</span>`;
    backBtn.onclick = showTopicList; // Link to go back
    errorDiv.appendChild(backBtn);

    // Add the error display to the main quiz container
    quizContainerElement.appendChild(errorDiv);
}


// --- Get Questions Data ---
// Retrieves questions for a specific lesson from the global topicsData object
function getQuestions(subject, semester, unitTitle, lessonTitle) {
    // Basic validation of input parameters
    if (!subject || !semester || !unitTitle || !lessonTitle) {
        console.error("Missing parameters for getQuestions:", { subject, semester, unitTitle, lessonTitle });
        return []; // Return empty array on invalid input
    }

    // Check if topicsData is loaded and available
    if (typeof topicsData === 'undefined' || !topicsData) {
        console.error("getQuestions Error: topicsData is not defined.");
        return [];
    }

    try {
        // Navigate through the data structure
        const semesterData = topicsData[subject]?.[semester];
        if (!semesterData?.units) {
            console.warn(`Units missing for subject/semester: ${subject} -> ${semester}`);
            return [];
        }

        // Find the matching unit by title
        const unit = semesterData.units.find(u => u?.title === unitTitle);
        if (!unit?.lessons) {
             console.warn(`Unit not found or has no lessons: "${unitTitle}" in ${subject} -> ${semester}.`);
             return [];
        }

        // Find the matching lesson by title
        const lesson = unit.lessons.find(l => l?.title === lessonTitle);
        if (!lesson) {
             console.warn(`Lesson not found: "${lessonTitle}" in unit "${unitTitle}".`);
             return [];
        }

        // Check if questions exist, is an array, and has items
        if (Array.isArray(lesson.questions) && lesson.questions.length > 0) {
            // Return a mapped array, ensuring all questions have a 'type' property
            // Default to 'multiple_choice' if type is missing
            return lesson.questions.map(q => ({
                type: 'multiple_choice', // Default type
                ...q // Spread the original question properties, overriding default type if present
            }));
        } else {
             // Log if lesson exists but has no questions
             console.log(`No questions found for lesson "${lessonTitle}".`);
             return []; // Return empty array if no questions defined
        }
    } catch (e) {
        // Catch any unexpected errors during data traversal
        console.error("Error retrieving questions from topicsData:", e, { subject, semester, unitTitle, lessonTitle });
        return []; // Return empty array on error
    }
}

// --- END OF script.js ---
