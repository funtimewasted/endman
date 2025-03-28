// --- START OF topics.js ---
// Data includes explanation fields now
const topicsData = {
    "english": {
        "first": {
            "title": "First Semester",
            "units": [
                {
                    "title": "Unit 1",
                    "lessons": [
                        {
                            "title": "Vocabulary & Grammar Basics",
                            "questions": [
                                {
                                    "type": "multiple_choice",
                                    "question": "Device in 'curtain of night fell'?",
                                    "options": ["Simile", "Metaphor", "Alliteration", "Hyperbole","test"],
                                    "answer": "Metaphor",
                                    "explanation": "A metaphor directly compares two unlike things without using 'like' or 'as'. 'Curtain of night' compares the falling night to a curtain closing."
                                },
                                {
                                    "type": "multiple_choice",
                                    "question": "'Ambiguous' means:",
                                    "options": ["Clear", "Uncertain", "Definite", "Determined"],
                                    "answer": "Uncertain"
                                    // No explanation provided for this one - it's optional
                                },
                                {
                                    "type": "ordering",
                                    "question": "Order alphabetically:",
                                    "items": ["Banana", "Apple", "Cherry", "Date", "Fig"],
                                    "answer": ["Apple", "Banana", "Cherry", "Date", "Fig"],
                                    "explanation": "Items are sorted based on the standard English alphabet order (A, B, C, D, F)."
                                },
                                {
                                    "type": "matching",
                                    "question": "Match country and capital:",
                                    "prompts": ["France", "Japan", "Egypt", "Brazil", "Canada"],
                                    "matches": ["Cairo", "Tokyo", "Paris", "Brasília", "Ottawa"],
                                    "answer": {
                                        "0": 2, // France -> Paris
                                        "1": 1, // Japan -> Tokyo
                                        "2": 0, // Egypt -> Cairo
                                        "3": 3, // Brazil -> Brasília
                                        "4": 4  // Canada -> Ottawa
                                    },
                                    "explanation": "Paris is the capital of France, Tokyo of Japan, Cairo of Egypt, Brasília of Brazil, and Ottawa of Canada."
                                },
                                {
                                    "type": "ordering",
                                    "question": "Order tea steps:",
                                    "items": ["Add tea bag", "Boil water", "Pour water"],
                                    "answer": ["Boil water", "Add tea bag", "Pour water"],
                                    "explanation": "You must boil the water first. Then, add the tea bag to the cup before pouring the hot water over it."
                                },
                                {
                                    "type": "multiple_choice",
                                    "question": "'Concise' means:", // Changed question for variety
                                    "options": ["Lengthy", "Wordy", "Brief", "Complicated"],
                                    "answer": "Brief",
                                    "explanation": "'Concise' means expressing much in few words; it's the opposite of lengthy or wordy."
                                },
                            ]
                        },
                        {
                            "title": "Past & Present Tenses & Question Tags",
                            "questions": [
                                {
                                    "type": "multiple_choice",
                                    "question": "Correct tense: 'She ___ to school every day.'", // Added frequency
                                    "options": ["go", "goes", "going", "went"],
                                    "answer": "goes",
                                     "explanation": "For third-person singular subjects (like 'She') in the present simple tense (used for routines like 'every day'), we add '-es' to verbs ending in 'o'."
                                },
                                {
                                    "type": "multiple_choice",
                                    "question": "Correct tag: 'You are studying, ___?'", // Corrected question
                                    "options": ["aren't you", "don't you", "isn't you", "won't you"],
                                    "answer": "aren't you",
                                    "explanation": "Question tags use the opposite form of the auxiliary verb ('are' becomes 'aren't') and the same subject pronoun ('you')."
                                }
                            ]
                        }
                    ]
                },
                {
                    "title": "Unit 2",
                    "lessons": [
                        { "title": "Reading and Vocabulary", "questions": [] },
                        { "title": "Future Forms", "questions": [] }
                    ]
                },
                {
                    "title": "Unit 3",
                    "lessons": [
                        { "title": "Reading and Vocabulary", "questions": [] },
                        { "title": "Habits & Clauses", "questions": [] }
                    ]
                },
                {
                    "title": "Unit 4",
                    "lessons": [
                        { "title": "Reading and Vocabulary", "questions": [] },
                        { "title": "Narration & Inversion", "questions": [] }
                    ]
                }
            ]
        },
        "second": {
            "title": "Second Semester",
            "units": [
                {
                    "title": "Unit 1",
                    "lessons": [
                        { "title": "Reading and Vocabulary", "questions": [] },
                        { "title": "Modal & Related & Articles", "questions": [] }
                    ]
                },
                {
                    "title": "Unit 2",
                    "lessons": [
                        { "title": "Reading and Vocabulary", "questions": [] },
                        { "title": "Reported Speech & Reporting Verbs", "questions": [] }
                    ]
                },
                {
                    "title": "Unit 3",
                    "lessons": [
                        { "title": "Reading and Vocabulary", "questions": [] },
                        { "title": "The Passive", "questions": [] }
                    ]
                },
                {
                    "title": "Unit 4",
                    "lessons": [
                        { "title": "Reading and Vocabulary", "questions": [] },
                        { "title": "Conditionals & Modals", "questions": [] }
                    ]
                },
                {
                    "title": "Unit 5",
                    "lessons": [
                        { "title": "Reading and Vocabulary", "questions": [] },
                        { "title": "Modals & Clauses", "questions": [] }
                    ]
                }
            ]
        }
    },

    "اللغة العربية": {
        "first": {
            "title": "الفصل الأول",
            "units": [
                {
                    "title": "الوحدة الأولى",
                    "lessons": [
                        {
                            "title": "من القيم الإنسانية في القرآن",
                            "questions": [
                                {
                                    "type": "multiple_choice",
                                    "question": "ما معنى كلمة 'البر' في قوله تعالى 'لن تنالوا البر حتى تنفقوا مما تحبون'؟",
                                    "options": ["الخير", "الصدق", "العدل", "الوفاء"],
                                    "answer": "الخير",
                                    "explanation": "البر هو اسم جامع لكل أنواع الخير والطاعة."
                                },
                                {
                                    "type": "ordering",
                                    "question": "رتب مراحل الوحي حسب نزولها:",
                                    "items": ["اقرأ باسم ربك", "المدثر", "الفاتحة"],
                                    "answer": ["اقرأ باسم ربك", "المدثر", "الفاتحة"],
                                    "explanation": "أول ما نزل من القرآن هو صدر سورة العلق ('اقرأ')، ثم تلاها فترة انقطاع، ثم نزلت سورة المدثر، وتعتبر الفاتحة أول سورة كاملة نزلت."
                                },
                                {
                                    "type": "matching",
                                    "question": "صل بين المصطلح وتعريفه:",
                                    "prompts": ["التجويد", "التفسير", "الناسخ والمنسوخ"],
                                    "matches": ["علم كيفية النطق الصحيح للقرآن", "علم بيان معاني القرآن", "علم الآيات التي تغير حكمها"],
                                    "answer": { "0": 0, "1": 1, "2": 2 },
                                    "explanation": "التجويد يتعلق بالنطق، التفسير ببيان المعنى، والناسخ والمنسوخ بتغير الأحكام."
                                 }
                            ]
                        },
                        {
                            "title": "اسلوب الطلب وجوابه المجزوم والتشبيه المفرد",
                            "questions": []
                        }
                    ]
                },
                {
                    "title": "الوحدة الثانية",
                    "lessons": [
                        { "title": "عمانيات", "questions": [] },
                        { "title": "صور الفاعل والتشبيه التمثيلي", "questions": [] }
                    ]
                },
                {
                    "title": "الوحدة الثالثة",
                    "lessons": [
                        { "title": "الزهايمر-الخرف المبكر", "questions": [] },
                        { "title": "صور المبتدأ والخبر والجملة الخبرية والإنشائية", "questions": [] }
                    ]
                },
                {
                    "title": "الوحدة الرابعة",
                    "lessons": [
                        { "title": "الإعلام ومشروع النهوض باللغة العربية", "questions": [] },
                        { "title": "المفعول معه والأمر", "questions": [] }
                    ]
                },
                {
                    "title": "الوحدة الخامسة",
                    "lessons": [
                        { "title": "التعليم التقني بوابة المستقبل في عالم متغير", "questions": [] },
                        { "title": "انواع ما والإستفهام", "questions": [] }
                    ]
                }
            ]
        },
        "second": {
            "title": "الفصل الثاني",
            "units": [
                {
                    "title": "الوحدة الأولى",
                    "lessons": [
                        { "title": "في فتح القدس", "questions": [] },
                        { "title": "معاني حروف الجر والتشخيص", "questions": [] }
                    ]
                },
                {
                    "title": "الوحدة الثانية",
                    "lessons": [
                        { "title": "قصة-حفنة تمر", "questions": [] },
                        { "title": "اسم الفاعل واسم المفعول والطباق والمقابلة", "questions": [] }
                    ]
                },
                {
                    "title": "الوحدة الثالثة",
                    "lessons": [
                        { "title": "شاعرات من بلدي", "questions": [] },
                        { "title": "اسم الزمان واسم المكان وجمع التكسير (القلة والكثرة)", "questions": [] }
                    ]
                },
                {
                    "title": "الوحدة الرابعة",
                    "lessons": [
                        { "title": "من مقامات بديع الزمان الهمذاني", "questions": [] },
                        { "title": "مصدر المرة ومصدر الهيئة والبحر المتدارك", "questions": [] }
                    ]
                },
                {
                    "title": "الوحدة الخامسة",
                    "lessons": [
                        { "title": "الذكاء الاصطناعي-عالم جديد", "questions": [] },
                        { "title": "اسم الآلة", "questions": [] }
                    ]
                }
            ]
        }
    },

    "التاريخ": {
        "first": {
            "title": "الفصل الأول",
            "units": [
                {
                    "title": "الأردن في العصور القديمة",
                    "lessons": [
                        {
                            "title": "الأردن في العصور الحجرية",
                            "questions": [
                                {
                                    "type": "multiple_choice",
                                    "question": "أي موقع أثري في الأردن يعود للعصر الحجري الحديث ويشتهر بالتماثيل العينية؟",
                                    "options": ["عين غزال", "جاوا", "بيضا", "أم قيس"],
                                    "answer": "عين غزال"
                                },
                                {
                                    "type": "ordering",
                                    "question": "رتب العصور الحجرية من الأقدم للأحدث:",
                                    "items": ["الحجري الحديث", "الحجري القديم", "الحجري الوسيط"],
                                    "answer": ["الحجري القديم", "الحجري الوسيط", "الحجري الحديث"]
                                }
                            ]
                        },
                        { "title": "الأردن في العصر الحديدي", "questions": [] },
                        { "title": "مملكة الأنباط", "questions": [] },
                        { "title": "مظاهر الحضارة اليونانية في الأردن", "questions": [] },
                        { "title": "مظاهر الحضارة الرومانية-البيزنطية في الأردن", "questions": [] }
                    ]
                },
                {
                    "title": "الأردن في صدر الإسلام",
                    "lessons": [
                        { "title": "الأردن في صدر الإسلام", "questions": [] },
                        { "title": "الأردن في العصر الأموي", "questions": [] },
                        { "title": "الأردن في العصر العباسي", "questions": [] },
                        { "title": "الأردن خلال حملات الفرنجة", "questions": [] },
                        { "title": "الأردن في العصر الأيوبي", "questions": [] },
                        { "title": "الأردن في العصر المملوكي", "questions": [] }
                    ]
                },
                {
                    "title": "الأردن في العصر الحديث",
                    "lessons": [
                        { "title": "الأوضاع السياسية والإدارية في الأردن في العهد العثماني", "questions": [] },
                        { "title": "الأوضاع الإجتماعية والإقتصادية الأردن في العهد العثماني", "questions": [] },
                        { "title": "الثورة العربية الكبرى", "questions": [] },
                        { "title": "الأردن في عهد المملكة العربية السورية والحكومات المحلية", "questions": [] }
                    ]
                }
            ]
        },
        "second": {
            "title": "الفصل الثاني",
            "units": [
                {
                    "title": "الحياة السياسية في الأردن",
                    "lessons": [
                        { "title": "تأسيس الإمارة الأردنية", "questions": [] },
                        { "title": "استقلال المملكة الأردنية الهاشمية", "questions": [] },
                        { "title": "تطور الحياة السياسية في الأردن بين عامي (1948-1957)", "questions": [] },
                        { "title": "تطور الحياة السياسية في الأردن بين عامي (1958-1999)", "questions": [] },
                        { "title": "الحياة السياسية في الأردن منذ 1999", "questions": [] },
                        { "title": "الأردن والعلاقات العربية والدولية", "questions": [] },
                        { "title": "القوات المسلحة الأردنية - الجيش العربي", "questions": [] },
                        { "title": "الأجهزة الأمنية الأردنية", "questions": [] }
                    ]
                },
                {
                    "title": "الحياة الاقتصادية في الأردن",
                    "lessons": [
                        { "title": "الحياة الاقتصادية في الأردن بين عامي (1921-1950)", "questions": [] },
                        { "title": "الحياة الاقتصادية في الأردن بين عامي (1951-1967)", "questions": [] },
                        { "title": "الحياة الاقتصادية في الأردن بين عامي (1968-1999)", "questions": [] },
                        { "title": "الحياة الاقتصادية في الأردن منذ عام 1999", "questions": [] }
                    ]
                },
                {
                    "title": "الحياة الاجتماعية في الأردن",
                    "lessons": [
                        { "title": "الحياة الاجتماعية في الأردن بين عامي (1921-1950)", "questions": [] },
                        { "title": "الحياة الاجتماعية في الأردن بين عامي (1951-1999)", "questions": [] },
                        { "title": "الحياة الاجتماعية في الأردن منذ عام 1999", "questions": [] }
                    ]
                },
                {
                    "title": "التعليم والثقافة في الأردن",
                    "lessons": [
                        { "title": "التعليم العام في الأردن بين عامي (1921-1950)", "questions": [] },
                        { "title": "التعليم العام في الأردن بين عامي (1951-1987)", "questions": [] },
                        { "title": "التعليم العام في الأردن بين عامي (1988-2024)", "questions": [] },
                        { "title": "التعليم العالي والبحث العلمي في الأردن منذ عام 1951", "questions": [] },
                        { "title": "الحياة الثقافية في الأردن في عهد الإمارة", "questions": [] },
                        { "title": "الحياة الثقافية في الأردن منذ عام 1946", "questions": [] }
                    ]
                },
                {
                    "title": "الأردن والقضية الفلسطينية",
                    "lessons": [
                        { "title": "موقف الأردن من القضية الفلسطينية بين عامي (1916-1951)", "questions": [] },
                        { "title": "موقف الأردن من القضية الفلسطينية منذ عام 1951", "questions": [] },
                        { "title": "الوصاية والإعمار الهاشمي للمقدسات الدينية في القدس", "questions": [] }
                    ]
                }
            ]
        }
    },

    "دين": {
        "first": {
            "title": "الفصل الأول",
            "units": [
                {
                    "title": "الوحدة الأولى",
                    "lessons": [
                        {
                            "title": "سورة آل عمران (102-105)",
                            "questions": [
                                {
                                    "type": "multiple_choice",
                                    "question": "ما هو الأمر الذي نهى الله عنه في قوله تعالى 'ولا تفرقوا'؟",
                                    "options": ["التعصب", "الخلاف المذموم المؤدي للعداوة", "الاختلاف الفقهي", "ترك الصلاة"],
                                    "answer": "الخلاف المذموم المؤدي للعداوة"
                                },
                                {
                                    "type": "multiple_choice",
                                    "question": "ما المقصود بـ 'حبل الله' في الآية؟",
                                    "options": ["القرآن والسنة", "الصلاة", "الزكاة", "الحج"],
                                    "answer": "القرآن والسنة"
                                }
                            ]
                        },
                        { "title": "حديث اتقاء الشبهات", "questions": [] },
                        { "title": "من صور الضلال", "questions": [] },
                        { "title": "كرامة الإنسان في الشريعة", "questions": [] },
                        { "title": "الزواج-مشروعيته ومقدماته", "questions": [] },
                        { "title": "الجهاد في الإسلام", "questions": [] }
                    ]
                },
                {
                    "title": "الوحدة الثانية",
                    "lessons": [
                        { "title": "جهود علماء المسلمين في خدمة القرآن", "questions": [] },
                        { "title": "العزيمة والرخصة", "questions": [] },
                        { "title": "معركة مؤتة (8 هجري)", "questions": [] },
                        { "title": "المحرمات من النساء", "questions": [] },
                        { "title": "التعايش الإنساني", "questions": [] },
                        { "title": "الحقوق الإجتماعية للمرأة في الإسلام", "questions": [] }
                    ]
                },
                {
                    "title": "الوحدة الثالثة",
                    "lessons": [
                        { "title": "سورة آل عمران (169-174)", "questions": [] },
                        { "title": "حديث - رضا الله تعالى", "questions": [] },
                        { "title": "فتح مكة (8 هجري)", "questions": [] },
                        { "title": "من خصائص الشريعة - الإيجابية", "questions": [] },
                        { "title": "شروط صحة عقد الزواج", "questions": [] },
                        { "title": "الحقوق المالية للمرأة في الإسلام", "questions": [] }
                    ]
                },
                {
                    "title": "الوحدة الرابعة",
                    "lessons": [
                        { "title": "سورة الروم (21-24)", "questions": [] },
                        { "title": "مكانة السنة النبوية في التشريع", "questions": [] },
                        { "title": "مراعاة الأعراف في الشريعة", "questions": [] },
                        { "title": "حقوق الزوجين", "questions": [] },
                        { "title": "تنظيم النسل وتحديده", "questions": [] },
                        { "title": "الأمن الغذائي في الإسلام", "questions": [] },
                        { "title": "الإسلام والوحدة الوطنية", "questions": [] }
                    ]
                }
            ]
        },
        "second": {
            "title": "الفصل الثاني",
            "units": [
                {
                    "title": "الوحدة الأولى",
                    "lessons": [
                        { "title": "سورة البقرة (284-286)", "questions": [] },
                        { "title": "دلائل وجود الله تعالى", "questions": [] },
                        { "title": "إعجاز القرآن الكريم", "questions": [] },
                        { "title": "الأمر بالمعروف والنهي عن المنكر", "questions": [] },
                        { "title": "اليوم الآخر - احداثه وآثار الإيمان به", "questions": [] },
                        { "title": "الإجتهاد في الإسلام", "questions": [] }
                    ]
                },
                {
                    "title": "الوحدة الثانية",
                    "lessons": [
                        { "title": "سورة الأعراف (31-34)", "questions": [] },
                        { "title": "مراعاة المصالح في الشريعة", "questions": [] },
                        { "title": "جهود علماء المسلمين في الحفاظ على السنة النبوية", "questions": [] },
                        { "title": "حديث - منهج الإسلام في الحياة", "questions": [] },
                        { "title": "رسائل النبي الى الملوك والزعماء في عصره", "questions": [] },
                        { "title": "يوم تبوك (9 هجري)", "questions": [] },
                        { "title": "الحقوق السياسية للمرأة في الإسلام", "questions": [] }
                    ]
                },
                {
                    "title": "الوحدة الثالثة",
                    "lessons": [
                        { "title": "سورة الفرقان (63-77)", "questions": [] },
                        { "title": "الطلاق", "questions": [] },
                        { "title": "العدة", "questions": [] },
                        { "title": "الوصية في الشريعة", "questions": [] },
                        { "title": "الميراث في الشريعة", "questions": [] },
                        { "title": "من خصائص الشريعة - الوسطية", "questions": [] },
                        { "title": "مجالات الوقف ودورها في التنمية", "questions": [] }
                    ]
                },
                {
                    "title": "الوحدة الرابعة",
                    "lessons": [
                        { "title": "حديث - مفهوم الإفلاس بين الدنيا والآخرة", "questions": [] },
                        { "title": "مقاصد الشريعة", "questions": [] },
                        { "title": "منهج الإسلام في مكافحة الجريمة", "questions": [] },
                        { "title": "من وصايا النبي في حجة الوداع", "questions": [] },
                        { "title": "المسؤولية المجتمعية في الإسلام", "questions": [] },
                        { "title": "حقوق الإنسان بين الإسلام والإعلان العالمي لحقوق الإنسان", "questions": [] }
                    ]
                }
            ]
        }
    }
};

// --- Functions to generate initial HTML content from topicsData ---
// (These need to be in this file as they directly use topicsData)

function generateSemesterContent(subject, semester) {
    const sanitizedSubject = subject.replace(/\s+/g, '-');
    const id = `${sanitizedSubject}-${semester}`;

    if (!topicsData[subject]?.[semester]) {
        return `<div id="${id}" class="semester-content"><div class="section"><p>Content unavailable for this semester.</p></div></div>`;
    }

    const semesterData = topicsData[subject][semester];
    let html = `<div id="${id}" class="semester-content">`; // Add ID here

    // Add Semester Title
    html += `<div class="semester-title-container"><div class="unit-title">${semesterData.title || 'Semester Topics'}</div></div>`;

    if (!semesterData.units?.length) {
        html += `<div class="section"><p>No units defined for this semester.</p></div>`;
    } else {
        semesterData.units.forEach(unit => {
            if (unit?.title) {
                html += `<div class="section">`;
                html += `<div class="section-title">${unit.title}</div>`;

                if (unit.lessons?.length) {
                    unit.lessons.forEach(lesson => {
                        if (lesson?.title) {
                            const qCount = lesson.questions?.length || 0;
                            const countText = qCount === 1 ? "1 Q" : `${qCount} Qs`;
                            // Add data attributes for subject, semester, unit, lesson
                            html += `<div class="section-content" data-subject="${subject}" data-semester="${semester}" data-unit="${unit.title}" data-lesson="${lesson.title}">`;
                            html += `    <span class="lesson-title-text">${lesson.title}</span>`;
                            html += `    <span class="lesson-stats-display"></span>`; // Placeholder for stats
                            html += `    <span class="lesson-q-count">(${countText})</span>`;
                            html += `</div>`;
                        }
                    });
                } else {
                    html += `<p style="font-size:14px;color:var(--text-muted);">(No lessons in this unit)</p>`;
                }
                html += `</div>`; // Close section
            }
        });
    }

    html += `</div>`; // Close semester-content div
    return html;
}

function generateAllContent() {
    let contentHtml = '';
    const contentDiv = document.getElementById('content');
    if (!contentDiv) {
        console.error("Could not find #content div to populate.");
        return;
    }

    // Generate HTML for all subjects and semesters defined in topicsData
    Object.keys(topicsData).forEach(subject => {
        Object.keys(topicsData[subject]).forEach(semester => {
            contentHtml += generateSemesterContent(subject, semester);
        });
    });

    contentDiv.innerHTML = contentHtml;
    // console.log("Initial content generated."); // Optional debug log
}

// *** Execute the generation immediately when this script loads ***
// This ensures the #content div is populated before the main script runs
// Note: This relies on the #content div already existing in the HTML when this script is parsed.
if (document.getElementById('content')) {
    generateAllContent();
} else {
    // Fallback if script is somehow loaded before #content exists (e.g., in <head> without defer)
    document.addEventListener('DOMContentLoaded', generateAllContent);
    console.warn("generateAllContent deferred until DOMContentLoaded as #content was not found immediately.");
}

// --- END OF topics.js ---
