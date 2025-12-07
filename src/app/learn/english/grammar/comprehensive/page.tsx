'use client'

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface GrammarTopic {
  id: string;
  title: string;
  emoji: string;
  category: 'vocabulary' | 'grammar' | 'tenses' | 'formality' | 'parts-of-speech';
  level: 'beginner' | 'elementary' | 'intermediate' | 'advanced';
  explanation: string;
  rules: string[];
  examples: Array<{
    english: string;
    indonesian: string;
    formality?: 'informal' | 'neutral' | 'formal' | 'royal';
    note?: string;
  }>;
  exercises: Array<{
    question: string;
    answer: string;
    explanation?: string;
  }>;
  tips: string[];
}

function ComprehensiveGrammarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const topicId = searchParams.get('topic') || 'parts-of-speech';
  
  const [currentTopic, setCurrentTopic] = useState<GrammarTopic | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const grammarTopics: GrammarTopic[] = [
    // ========== PARTS OF SPEECH (KELAS KATA) ==========
    {
      id: 'parts-of-speech',
      title: 'Parts of Speech (8 Kelas Kata)',
      emoji: '📝',
      category: 'parts-of-speech',
      level: 'beginner',
      explanation: 'Dalam bahasa Inggris, setiap kata masuk ke dalam 8 kategori berbeda. Memahami ini adalah fondasi grammar yang kuat!',
      rules: [
        'Noun (Kata Benda) - person, place, thing, idea',
        'Pronoun (Kata Ganti) - I, you, he, she, it, we, they',
        'Verb (Kata Kerja) - action or state of being',
        'Adjective (Kata Sifat) - describes nouns',
        'Adverb (Kata Keterangan) - describes verbs, adjectives, or other adverbs',
        'Preposition (Kata Depan) - shows relationship (in, on, at, to)',
        'Conjunction (Kata Hubung) - connects words/sentences (and, but, or)',
        'Interjection (Kata Seru) - expresses emotion (Oh! Wow! Ouch!)'
      ],
      examples: [
        {
          english: 'The beautiful girl quickly ran to the big house.',
          indonesian: 'Gadis cantik itu cepat berlari ke rumah besar.',
          note: 'The=Article, beautiful=Adjective, girl=Noun, quickly=Adverb, ran=Verb, to=Preposition, the=Article, big=Adjective, house=Noun'
        }
      ],
      exercises: [
        {
          question: 'Identify the noun: "The cat sleeps on the mat"',
          answer: 'cat, mat',
          explanation: 'Noun adalah kata benda: cat (kucing), mat (tikar)'
        },
        {
          question: 'Identify the verb: "She runs very fast"',
          answer: 'runs',
          explanation: 'Verb adalah kata kerja: runs (berlari)'
        }
      ],
      tips: [
        'Hafalkan 8 parts of speech sebagai fondasi',
        'Latihan identifikasi setiap kata dalam kalimat',
        'Noun biasanya bisa ditambah "the" di depannya'
      ]
    },
    {
      id: 'nouns',
      title: 'Nouns (Kata Benda) - Detail',
      emoji: '🏠',
      category: 'parts-of-speech',
      level: 'elementary',
      explanation: 'Noun adalah kata benda. Ada beberapa jenis noun yang penting dipahami.',
      rules: [
        'Common Noun - nama umum (boy, city, car)',
        'Proper Noun - nama khusus, huruf besar (John, Jakarta, Toyota)',
        'Countable Noun - bisa dihitung (apple, apples)',
        'Uncountable Noun - tidak bisa dihitung (water, sugar, rice)',
        'Collective Noun - kumpulan (team, family, class)',
        'Abstract Noun - tidak kasat mata (love, happiness, freedom)'
      ],
      examples: [
        { english: 'I have three apples', indonesian: 'Saya punya tiga apel', note: 'Countable - bisa ditambah s' },
        { english: 'Please give me some water', indonesian: 'Tolong beri saya air', note: 'Uncountable - tidak bisa: two waters ❌' },
        { english: 'The team is ready', indonesian: 'Tim siap', note: 'Collective noun - grup dianggap satu kesatuan' },
        { english: 'Love conquers all', indonesian: 'Cinta mengalahkan segalanya', note: 'Abstract noun - konsep, bukan benda fisik' }
      ],
      exercises: [
        { question: 'Countable or Uncountable: "money"?', answer: 'Uncountable', explanation: 'Money tidak bisa dihitung langsung (tidak bisa: one money, two moneys)' },
        { question: 'Write plural of "child"', answer: 'children', explanation: 'Irregular plural - tidak mengikuti aturan +s' }
      ],
      tips: [
        'Countable → bisa pakai a/an dan angka (a book, two books)',
        'Uncountable → pakai some/much (some water, much rice)',
        'Proper noun selalu huruf besar di awal'
      ]
    },
    {
      id: 'pronouns',
      title: 'Pronouns (Kata Ganti) - Lengkap',
      emoji: '👥',
      category: 'parts-of-speech',
      level: 'elementary',
      explanation: 'Pronoun menggantikan noun agar tidak mengulang-ulang. Ada banyak jenis pronoun yang berbeda!',
      rules: [
        'Subject Pronouns: I, you, he, she, it, we, they',
        'Object Pronouns: me, you, him, her, it, us, them',
        'Possessive Adjectives: my, your, his, her, its, our, their',
        'Possessive Pronouns: mine, yours, his, hers, its, ours, theirs',
        'Reflexive Pronouns: myself, yourself, himself, herself, itself, ourselves, themselves'
      ],
      examples: [
        { english: 'I love you', indonesian: 'Saya mencintai kamu', note: 'I=subject, you=object' },
        { english: 'This is my book. It is mine.', indonesian: 'Ini buku saya. Ini punya saya.', note: 'my=possessive adjective, mine=possessive pronoun' },
        { english: 'She hurt herself', indonesian: 'Dia melukai dirinya sendiri', note: 'herself=reflexive pronoun' },
        { english: 'He did it himself', indonesian: 'Dia melakukannya sendiri', note: 'himself untuk penekanan "sendiri"' }
      ],
      exercises: [
        { question: 'Fill: "This pen is ___ (my/mine)"', answer: 'mine', explanation: 'Setelah "is" tanpa noun, pakai possessive pronoun (mine)' },
        { question: 'Fill: "___ (He/Him) is my friend"', answer: 'He', explanation: 'Sebagai subjek kalimat, pakai subject pronoun (He)' }
      ],
      tips: [
        'Subject pronoun → sebelum verb (I go, he runs)',
        'Object pronoun → setelah verb/preposition (love me, with him)',
        'Possessive adjective → sebelum noun (my book)',
        'Possessive pronoun → tanpa noun (the book is mine)'
      ]
    },
    {
      id: 'adjectives',
      title: 'Adjectives (Kata Sifat) & Order',
      emoji: '🎨',
      category: 'parts-of-speech',
      level: 'intermediate',
      explanation: 'Adjective mendeskripsikan noun. Dalam bahasa Inggris, ada aturan ORDER saat pakai banyak adjective!',
      rules: [
        'Order: Opinion > Size > Age > Shape > Color > Origin > Material > Purpose',
        'Example: A beautiful (opinion) big (size) old (age) rectangular (shape) brown (color) Italian (origin) wooden (material) dining (purpose) table',
        'Comparative: -er / more (bigger, more beautiful)',
        'Superlative: -est / most (biggest, most beautiful)',
        'Extreme adjectives: excellent, awful, terrible, gorgeous (tidak pakai very)'
      ],
      examples: [
        { english: 'A beautiful small round blue glass vase', indonesian: 'Vas kaca biru bulat kecil cantik', note: 'Opinion > Size > Shape > Color > Material' },
        { english: 'She is taller than me', indonesian: 'Dia lebih tinggi dari saya', note: 'Comparative: tall → taller' },
        { english: 'He is the smartest student', indonesian: 'Dia murid paling pintar', note: 'Superlative: smart → smartest' },
        { english: 'The movie was absolutely terrible', indonesian: 'Filmnya sangat buruk', note: 'Extreme adjective: terrible (tidak: very terrible)' }
      ],
      exercises: [
        { question: 'Order: "wooden old small" → correct order?', answer: 'small old wooden', explanation: 'Size > Age > Material' },
        { question: 'Comparative of "good"?', answer: 'better', explanation: 'Irregular: good → better → best' }
      ],
      tips: [
        'Hafalkan: OpShAShCoOriMaPu (Opinion, Shape, Age, Shape, Color, Origin, Material, Purpose)',
        '1 syllable: add -er/-est (tall, taller, tallest)',
        '3+ syllables: more/most (beautiful, more beautiful, most beautiful)',
        'Irregular: good-better-best, bad-worse-worst'
      ]
    },
    {
      id: 'adverbs',
      title: 'Adverbs (Kata Keterangan) - Complete',
      emoji: '⚡',
      category: 'parts-of-speech',
      level: 'intermediate',
      explanation: 'Adverb menjelaskan HOW (cara), WHEN (waktu), WHERE (tempat), HOW OFTEN (frekuensi), HOW MUCH (tingkat).',
      rules: [
        'Adverbs of Manner (cara): quickly, slowly, carefully, well, badly',
        'Adverbs of Time (waktu): now, yesterday, soon, already, yet',
        'Adverbs of Place (tempat): here, there, everywhere, inside, outside',
        'Adverbs of Frequency (frekuensi): always, usually, often, sometimes, rarely, never',
        'Adverbs of Degree (tingkat): very, extremely, quite, rather, too, enough',
        'Position: Manner (end), Frequency (before main verb), Time (end or beginning)'
      ],
      examples: [
        { english: 'She runs quickly', indonesian: 'Dia berlari dengan cepat', note: 'Manner - di akhir setelah verb' },
        { english: 'I always wake up at 6 AM', indonesian: 'Saya selalu bangun jam 6 pagi', note: 'Frequency - sebelum main verb' },
        { english: 'The movie was extremely boring', indonesian: 'Filmnya sangat membosankan', note: 'Degree - sebelum adjective' },
        { english: 'He speaks English very well', indonesian: 'Dia berbicara bahasa Inggris sangat baik', note: 'Manner "well" tidak pakai -ly' }
      ],
      exercises: [
        { question: 'Add adverb: "She speaks English ___" (fluent)', answer: 'fluently', explanation: 'Adjective fluent → Adverb fluently (tambah -ly)' },
        { question: 'Position: Where does "always" go in "I ___ eat breakfast"?', answer: 'I always eat breakfast', explanation: 'Frequency adverb sebelum main verb' }
      ],
      tips: [
        'Kebanyakan adverb = adjective + -ly (quick → quickly)',
        'Irregular: good → well, fast → fast, hard → hard',
        'Frequency order: always > usually > often > sometimes > rarely > never',
        'Very + adjective/adverb, Too = berlebihan (too expensive)'
      ]
    },

    // ========== TENSES (COMPLETE) ==========
    {
      id: 'present-simple',
      title: 'Present Simple Tense',
      emoji: '⏰',
      category: 'tenses',
      level: 'beginner',
      explanation: 'Present Simple untuk: (1) Kebiasaan/rutinitas, (2) Fakta umum, (3) Jadwal tetap',
      rules: [
        'Positive: S + V1 (+ s/es untuk he/she/it)',
        'Negative: S + do/does + not + V1',
        'Question: Do/Does + S + V1?',
        'Time markers: every day, always, usually, often, sometimes, never',
        'He/She/It → tambah -s atau -es (goes, watches, studies)'
      ],
      examples: [
        { english: 'I go to school every day', indonesian: 'Saya pergi ke sekolah setiap hari', note: 'Kebiasaan/rutinitas' },
        { english: 'The sun rises in the east', indonesian: 'Matahari terbit di timur', note: 'Fakta umum' },
        { english: 'The train leaves at 8 AM', indonesian: 'Kereta berangkat jam 8 pagi', note: 'Jadwal tetap' },
        { english: 'She does not like coffee', indonesian: 'Dia tidak suka kopi', note: 'Negative dengan does not (doesn\'t)' }
      ],
      exercises: [
        { question: 'Complete: He ___ (play) football every Sunday', answer: 'plays', explanation: 'He/She/It + verb-s' },
        { question: 'Make negative: "They like pizza"', answer: 'They do not/don\'t like pizza', explanation: 'I/You/We/They → do not' }
      ],
      tips: [
        'I/You/We/They → verb asli (play, eat, go)',
        'He/She/It → verb + s/es (plays, eats, goes)',
        'Negative & Question → pakai do/does + verb asli',
        'Stative verbs (like, love, know, understand) jarang pakai continuous'
      ]
    },
    {
      id: 'present-continuous',
      title: 'Present Continuous Tense',
      emoji: '▶️',
      category: 'tenses',
      level: 'elementary',
      explanation: 'Present Continuous untuk: (1) Terjadi SEKARANG, (2) Rencana masa depan dekat, (3) Situasi sementara',
      rules: [
        'Formula: S + am/is/are + V-ing',
        'I am, You are, He/She/It is, We/You/They are',
        'Negative: am/is/are + not + V-ing',
        'Question: Am/Is/Are + S + V-ing?',
        'Time markers: now, right now, at the moment, currently, Look! Listen!'
      ],
      examples: [
        { english: 'I am studying English now', indonesian: 'Saya sedang belajar bahasa Inggris sekarang', note: 'Sedang berlangsung SEKARANG' },
        { english: 'She is coming tomorrow', indonesian: 'Dia akan datang besok', note: 'Rencana masa depan yang sudah pasti' },
        { english: 'He is living in Jakarta temporarily', indonesian: 'Dia tinggal di Jakarta sementara', note: 'Situasi sementara, bukan permanen' },
        { english: 'Look! The baby is crying', indonesian: 'Lihat! Bayinya menangis', note: 'Look/Listen menunjukkan sesuatu terjadi sekarang' }
      ],
      exercises: [
        { question: 'Complete: They ___ (watch) TV right now', answer: 'are watching', explanation: 'They + are + verb-ing' },
        { question: 'Make question: "She is reading a book"', answer: 'Is she reading a book?', explanation: 'Is + subject + verb-ing?' }
      ],
      tips: [
        'Spelling: run → running (double consonant), make → making (hilangkan e)',
        'Tidak bisa: I am knowing ❌ → I know ✅ (stative verbs)',
        'Present Continuous bisa untuk future jika sudah ada plan pasti',
        'Now vs Every day: Now=Continuous, Every day=Simple'
      ]
    },
    {
      id: 'past-simple',
      title: 'Past Simple Tense',
      emoji: '📅',
      category: 'tenses',
      level: 'elementary',
      explanation: 'Past Simple untuk kejadian yang SUDAH SELESAI di masa lalu dengan waktu yang jelas.',
      rules: [
        'Regular verbs: V1 + -ed (play → played, work → worked)',
        'Irregular verbs: berbeda total (go → went, eat → ate, see → saw)',
        'Negative: S + did not + V1',
        'Question: Did + S + V1?',
        'Time markers: yesterday, last week/month/year, ago, in 2020, when I was young'
      ],
      examples: [
        { english: 'I visited Bali last month', indonesian: 'Saya mengunjungi Bali bulan lalu', note: 'Regular verb: visit → visited' },
        { english: 'She went to school yesterday', indonesian: 'Dia pergi ke sekolah kemarin', note: 'Irregular: go → went' },
        { english: 'They did not come to the party', indonesian: 'Mereka tidak datang ke pesta', note: 'Negative: did not + come (verb asli)' },
        { english: 'Did you see the movie?', indonesian: 'Apakah kamu melihat filmnya?', note: 'Question: Did + you + see (verb asli)' }
      ],
      exercises: [
        { question: 'Past tense of "study"?', answer: 'studied', explanation: 'Ending -y → -ied (study → studied)' },
        { question: 'Past tense of "buy"?', answer: 'bought', explanation: 'Irregular verb - harus dihafalkan' }
      ],
      tips: [
        'Regular: play→played, work→worked, stop→stopped',
        'Irregular: HARUS DIHAFALKAN (go-went, eat-ate, see-saw)',
        'Negative & Question: pakai DID + verb asli',
        'Was/Were untuk to be: I/He/She/It was, You/We/They were'
      ]
    },
    {
      id: 'past-continuous',
      title: 'Past Continuous Tense',
      emoji: '⏮️',
      category: 'tenses',
      level: 'intermediate',
      explanation: 'Past Continuous untuk: (1) Aksi sedang berlangsung di masa lalu, (2) Dua aksi bersamaan di masa lalu, (3) Background situation',
      rules: [
        'Formula: S + was/were + V-ing',
        'I/He/She/It was, You/We/They were',
        'Sering dengan "when" + Past Simple',
        'Sering dengan "while" + Past Continuous lagi',
        'Time markers: at 8 PM yesterday, when he called, while I was sleeping'
      ],
      examples: [
        { english: 'I was studying at 8 PM yesterday', indonesian: 'Saya sedang belajar jam 8 kemarin', note: 'Aksi sedang berlangsung di waktu tertentu' },
        { english: 'When he called, I was sleeping', indonesian: 'Ketika dia menelepon, saya sedang tidur', note: 'When + Past Simple, Past Continuous' },
        { english: 'While I was cooking, he was watching TV', indonesian: 'Sementara saya memasak, dia menonton TV', note: 'Dua aksi bersamaan' },
        { english: 'The sun was shining and birds were singing', indonesian: 'Matahari bersinar dan burung-burung bernyanyi', note: 'Background description' }
      ],
      exercises: [
        { question: 'Complete: They ___ (play) when it started raining', answer: 'were playing', explanation: 'They + were + verb-ing' },
        { question: 'Choose: "When I arrived, she ___ (cooked/was cooking)"', answer: 'was cooking', explanation: 'Aksi sedang berlangsung saat tiba' }
      ],
      tips: [
        'Past Continuous = was/were + verb-ing',
        'When + Past Simple, Past Continuous (aksi pendek interrupt aksi panjang)',
        'While + Past Continuous (dua aksi panjang bersamaan)',
        'Background (sedang terjadi) vs Main event (tiba-tiba terjadi)'
      ]
    },
    {
      id: 'present-perfect',
      title: 'Present Perfect Tense',
      emoji: '✅',
      category: 'tenses',
      level: 'intermediate',
      explanation: 'Present Perfect menghubungkan masa lalu dengan sekarang: (1) Pengalaman hidup, (2) Hasil yang masih relevan, (3) Sudah/belum',
      rules: [
        'Formula: S + have/has + V3 (Past Participle)',
        'I/You/We/They have, He/She/It has',
        'Time markers: ever, never, already, yet, just, recently, so far, up to now',
        'Tidak pakai waktu spesifik (tidak: yesterday, last week)',
        'Ever (pernah?), Never (tidak pernah), Already (sudah), Yet (belum)'
      ],
      examples: [
        { english: 'I have visited Japan', indonesian: 'Saya pernah mengunjungi Jepang', note: 'Pengalaman hidup (tidak tahu kapan, tidak penting)' },
        { english: 'She has finished her homework', indonesian: 'Dia sudah menyelesaikan PR-nya', note: 'Sudah selesai, hasil masih relevan sekarang' },
        { english: 'Have you ever eaten sushi?', indonesian: 'Apakah kamu pernah makan sushi?', note: 'Question tentang pengalaman' },
        { english: 'I have not seen him yet', indonesian: 'Saya belum melihatnya', note: 'Yet = belum (di akhir negative/question)' }
      ],
      exercises: [
        { question: 'Complete: She ___ (go) to London three times', answer: 'has gone', explanation: 'She + has + V3 (go-went-gone)' },
        { question: 'Past Participle of "write"?', answer: 'written', explanation: 'Irregular: write-wrote-written' }
      ],
      tips: [
        'Regular V3 = V2 (played, worked)',
        'Irregular V3: HARUS HAFALKAN (go-went-gone, eat-ate-eaten)',
        'Present Perfect vs Past Simple: PE=pengalaman umum, PS=waktu spesifik',
        'Already (sudah, positive), Yet (belum, negative/question)',
        'Just = baru saja (I have just arrived)'
      ]
    },
    {
      id: 'future-tenses',
      title: 'Future Tenses (Will, Going to, Present Continuous)',
      emoji: '🔮',
      category: 'tenses',
      level: 'intermediate',
      explanation: 'Ada 3 cara utama menyatakan future, masing-masing punya fungsi berbeda!',
      rules: [
        'Will: (1) Prediksi umum, (2) Keputusan spontan, (3) Janji/penawaran',
        'Going to: (1) Rencana/intention, (2) Prediksi dengan bukti',
        'Present Continuous: (1) Arrangement/appointment yang fixed',
        'Future Perfect: will have + V3 (sudah selesai di masa depan)',
        'Future Continuous: will be + V-ing (sedang berlangsung di masa depan)'
      ],
      examples: [
        { english: 'It will rain tomorrow', indonesian: 'Akan hujan besok', formality: 'neutral', note: 'Will - prediksi umum' },
        { english: 'I\'m going to study tonight', indonesian: 'Saya akan belajar malam ini', formality: 'neutral', note: 'Going to - rencana/intention' },
        { english: 'I\'m meeting John at 5 PM', indonesian: 'Saya bertemu John jam 5 sore', formality: 'neutral', note: 'Present Continuous - janji/appointment fixed' },
        { english: 'By 2030, I will have graduated', indonesian: 'Pada 2030, saya akan sudah lulus', formality: 'formal', note: 'Future Perfect - sudah selesai di waktu tertentu masa depan' }
      ],
      exercises: [
        { question: 'Choose: "I ___ (will buy / am going to buy) a car. I\'ve saved money."', answer: 'am going to buy', explanation: 'Sudah ada persiapan → going to' },
        { question: 'Choose: "Hold on. I ___ (will help / am going to help) you."', answer: 'will help', explanation: 'Keputusan spontan → will' }
      ],
      tips: [
        'Will = spontan, prediksi, janji ("I will help you")',
        'Going to = rencana, prediksi dengan bukti ("Look at the clouds, it\'s going to rain")',
        'Present Continuous = appointment fixed ("I\'m flying to Tokyo tomorrow")',
        'Shall (formal UK) = untuk offer/suggestion'
      ]
    },

    // ========== FORMALITY LEVELS ==========
    {
      id: 'formality-levels',
      title: 'Levels of Formality - Informal to Royal',
      emoji: '👔',
      category: 'formality',
      level: 'advanced',
      explanation: 'Bahasa Inggris punya tingkat formalitas berbeda: Informal (teman), Neutral (umum), Formal (profesional), Royal (kerajaan).',
      rules: [
        'Informal: Contractions (I\'m, you\'re), slang, casual vocabulary',
        'Neutral: Standard English, bisa untuk sebagian besar situasi',
        'Formal: No contractions, sophisticated vocabulary, passive voice',
        'Royal/Very Formal: Traditional phrases, extremely polite, archaic terms',
        'Passive voice lebih formal dari active voice'
      ],
      examples: [
        {
          english: 'Wanna grab some food?',
          indonesian: 'Mau makan?',
          formality: 'informal',
          note: 'Dengan teman dekat - wanna=want to, grab=ambil (informal)'
        },
        {
          english: 'Would you like to have dinner?',
          indonesian: 'Apakah Anda ingin makan malam?',
          formality: 'neutral',
          note: 'Umum - sopan tapi tidak terlalu formal'
        },
        {
          english: 'Would you care to join us for dinner this evening?',
          indonesian: 'Apakah Anda berkenan bergabung dengan kami untuk makan malam ini?',
          formality: 'formal',
          note: 'Profesional - "care to" lebih formal, "this evening" formal dari "tonight"'
        },
        {
          english: 'We should be most honoured if Your Excellency would graciously consent to dine with us.',
          indonesian: 'Kami akan sangat terhormat jika Yang Mulia berkenan menerima undangan makan bersama kami.',
          formality: 'royal',
          note: 'Kerajaan - "most honoured", "graciously consent", "Your Excellency"'
        }
      ],
      exercises: [
        {
          question: 'Make formal: "Can you help me?"',
          answer: 'Could you assist me, please? / Would you be able to help me?',
          explanation: 'Can→Could/Would, help→assist, tambah please'
        },
        {
          question: 'Make informal: "I do not know"',
          answer: 'I don\'t know / Dunno',
          explanation: 'do not→don\'t (contraction), atau dunno (very informal)'
        }
      ],
      tips: [
        'Semakin formal, semakin panjang kalimatnya',
        'Formal: hindari contractions (I am not I\'m)',
        'Gunakan modal verbs (could, would, might) untuk lebih sopan',
        'Passive voice untuk formal writing'
      ]
    },
    {
      id: 'polite-requests',
      title: 'Polite Requests & Offers (Sopan Santun)',
      emoji: '🙏',
      category: 'formality',
      level: 'intermediate',
      explanation: 'Cara meminta dan menawarkan sesuatu dengan sopan - penting untuk komunikasi profesional!',
      rules: [
        'Modal verbs untuk kesopanan: Could > Would > Can > Will',
        'Tambahkan: please, possibly, perhaps, if you don\'t mind',
        'Indirect questions lebih sopan dari direct questions',
        'Sorry to bother you, but... = sangat sopan',
        'I was wondering if... = sangat formal dan sopan'
      ],
      examples: [
        { english: 'Give me the pen', indonesian: 'Beri saya pulpennya', formality: 'informal', note: 'Direct - terdengar rude/kasar' },
        { english: 'Can you give me the pen?', indonesian: 'Bisakah kamu memberi saya pulpennya?', formality: 'neutral', note: 'Netral - acceptable tapi bisa lebih sopan' },
        { english: 'Could you pass me the pen, please?', indonesian: 'Bisakah Anda memberikan pulpennya?', formality: 'formal', note: 'Formal - Could lebih sopan, tambah please' },
        { english: 'Would you mind passing me the pen?', indonesian: 'Apakah Anda keberatan memberikan pulpennya?', formality: 'formal', note: 'Very polite - "mind" = keberatan' },
        { english: 'I was wondering if you could possibly pass me the pen?', indonesian: 'Saya bertanya-tanya apakah Anda bisa memberikan pulpennya?', formality: 'royal', note: 'Extremely polite - indirect, possibly, wondering' }
      ],
      exercises: [
        {
          question: 'Make polite: "Tell me your name"',
          answer: 'Could you tell me your name, please? / May I ask your name?',
          explanation: 'Gunakan Could/May, tambah please'
        },
        {
          question: 'Make more polite: "Can you help?"',
          answer: 'Would you mind helping me? / I was wondering if you could help?',
          explanation: 'Would you mind / I was wondering = very polite'
        }
      ],
      tips: [
        'Can → bisa, tapi kurang sopan untuk formal',
        'Could/Would → lebih sopan',
        'May → sangat formal (May I...?)',
        'Mind → "Would you mind..." sangat sopan',
        'I\'m afraid... → menolak dengan sopan'
      ]
    },
    {
      id: 'business-english',
      title: 'Business & Professional English',
      emoji: '💼',
      category: 'formality',
      level: 'advanced',
      explanation: 'Bahasa Inggris untuk dunia kerja profesional - email, meeting, presentation.',
      rules: [
        'Email: Dear Sir/Madam (tidak tahu nama), Dear Mr./Ms. [Name] (tahu nama)',
        'Opening: I am writing to... / I would like to inquire about...',
        'Body: Formal vocabulary, passive voice, linking words',
        'Closing: Yours sincerely (tahu nama), Yours faithfully (tidak tahu nama)',
        'Modern: Best regards, Kind regards (less formal tapi accepted)'
      ],
      examples: [
        {
          english: 'Dear Sir/Madam, I am writing to inquire about the position advertised on your website.',
          indonesian: 'Yang Terhormat, Saya menulis untuk menanyakan tentang posisi yang diiklankan di website Anda.',
          formality: 'formal',
          note: 'Email formal - opening'
        },
        {
          english: 'I would appreciate it if you could send me further information.',
          indonesian: 'Saya akan sangat menghargai jika Anda bisa mengirimkan informasi lebih lanjut.',
          formality: 'formal',
          note: 'Polite request dalam email'
        },
        {
          english: 'Please find attached my curriculum vitae for your consideration.',
          indonesian: 'Terlampir CV saya untuk pertimbangan Anda.',
          formality: 'formal',
          note: 'Attachment - "please find attached"'
        },
        {
          english: 'I look forward to hearing from you at your earliest convenience.',
          indonesian: 'Saya menantikan kabar dari Anda secepatnya.',
          formality: 'formal',
          note: 'Closing formal email'
        }
      ],
      exercises: [
        {
          question: 'Start formal email to unknown person',
          answer: 'Dear Sir/Madam,',
          explanation: 'Tidak tahu nama → Dear Sir/Madam'
        },
        {
          question: 'Closing untuk formal email (tahu nama)',
          answer: 'Yours sincerely,',
          explanation: 'Tahu nama → Yours sincerely'
        }
      ],
      tips: [
        'Hindari contractions dalam business writing',
        'Gunakan passive voice: "It has been decided..." (formal)',
        'Linking words: Furthermore, However, Therefore, Nevertheless',
        'CC = carbon copy, BCC = blind carbon copy',
        'Subject line harus jelas dan concise'
      ]
    },
    {
      id: 'british-vs-american',
      title: 'British vs American English',
      emoji: '🇬🇧🇺🇸',
      category: 'formality',
      level: 'advanced',
      explanation: 'Perbedaan antara British English (UK) dan American English (US) - spelling, vocabulary, grammar.',
      rules: [
        'Spelling: UK -our vs US -or (colour vs color)',
        'Spelling: UK -ise vs US -ize (realise vs realize)',
        'Spelling: UK -re vs US -er (centre vs center)',
        'Grammar: UK "have got" vs US "have" (I\'ve got vs I have)',
        'Grammar: UK collective nouns plural vs US singular (The team are vs The team is)'
      ],
      examples: [
        { english: 'Colour (UK) / Color (US)', indonesian: 'Warna', note: '-our vs -or' },
        { english: 'Realise (UK) / Realize (US)', indonesian: 'Menyadari', note: '-ise vs -ize' },
        { english: 'Centre (UK) / Center (US)', indonesian: 'Pusat', note: '-re vs -er' },
        { english: 'Flat (UK) / Apartment (US)', indonesian: 'Apartemen', note: 'Vocabulary berbeda' },
        { english: 'Lift (UK) / Elevator (US)', indonesian: 'Lift', note: 'Vocabulary berbeda' },
        { english: 'Lorry (UK) / Truck (US)', indonesian: 'Truk', note: 'Vocabulary berbeda' },
        { english: 'I\'ve got a car (UK) / I have a car (US)', indonesian: 'Saya punya mobil', note: 'have got vs have' },
        { english: 'The team are playing (UK) / The team is playing (US)', indonesian: 'Tim sedang bermain', note: 'Collective noun' }
      ],
      exercises: [
        { question: 'British spelling: "organize"', answer: 'organise', explanation: '-ize → -ise dalam British' },
        { question: 'American word for "autumn"', answer: 'fall', explanation: 'Autumn (UK) = Fall (US)' }
      ],
      tips: [
        'British English lebih formal dan traditional',
        'American English lebih simplified',
        'Di akademik/formal: lebih sering British',
        'Di tech/business global: sering American',
        'Konsisten dalam satu dokumen (jangan campur UK dan US)'
      ]
    },
    {
      id: 'royal-english',
      title: 'Royal English & Court Language',
      emoji: '👑',
      category: 'formality',
      level: 'advanced',
      explanation: 'Bahasa Inggris tingkat kerajaan - sangat formal, digunakan dalam konteks royal court, diplomatic, ceremonial.',
      rules: [
        'Royal titles: Your Majesty (Raja/Ratu), Your Royal Highness (Pangeran/Putri)',
        'Third person: "Her Majesty wishes..." (bukan "I wish...")',
        'Archaic terms: Whilst (while), amongst (among), upon (on)',
        'Formal verbs: consent, graciously, humbly, beseech, request the honour',
        'Passive constructions: "It is requested..." bukan "We request..."'
      ],
      examples: [
        {
          english: 'Your Majesty, we humbly request your gracious presence.',
          indonesian: 'Yang Mulia, kami dengan rendah hati memohon kehadiran Anda.',
          formality: 'royal',
          note: 'Royal address - humbly request, gracious presence'
        },
        {
          english: 'Her Majesty has graciously consented to attend the ceremony.',
          indonesian: 'Yang Mulia telah berkenan hadir dalam upacara.',
          formality: 'royal',
          note: 'Third person, graciously consented'
        },
        {
          english: 'It would be our greatest honour to welcome Your Royal Highness.',
          indonesian: 'Akan menjadi kehormatan terbesar kami menyambut Yang Mulia.',
          formality: 'royal',
          note: 'Superlative (greatest), formal vocabulary'
        },
        {
          english: 'We beseech Your Majesty\'s indulgence in this matter.',
          indonesian: 'Kami memohon pengertian Yang Mulia dalam hal ini.',
          formality: 'royal',
          note: 'Beseech (archaic for "ask"), indulgence'
        }
      ],
      exercises: [
        {
          question: 'Address to King/Queen',
          answer: 'Your Majesty',
          explanation: 'King/Queen = Your Majesty (bukan Your Highness)'
        },
        {
          question: 'Make royal: "We ask you to come"',
          answer: 'We humbly request Your Majesty\'s gracious presence / We should be honoured by Your Majesty\'s attendance',
          explanation: 'Gunakan humbly, request, gracious, honoured'
        }
      ],
      tips: [
        'Your Majesty untuk King/Queen (first address), then "Ma\'am/Sir"',
        'Your Royal Highness untuk Prince/Princess',
        'Your Excellency untuk Ambassador/High officials',
        'Gunakan: graciously, humbly, beseech, honour, consent',
        'Third person lebih formal: "Her Majesty wishes..." bukan "I wish..."',
        'Archaic vocabulary: whilst, amongst, upon, henceforth'
      ]
    }
  ];

  useEffect(() => {
    const topic = grammarTopics.find(t => t.id === topicId);
    setCurrentTopic(topic || grammarTopics[0]);
  }, [topicId]);

  const categories = [
    { id: 'all', name: 'All Topics', emoji: '📚' },
    { id: 'parts-of-speech', name: 'Parts of Speech', emoji: '📝' },
    { id: 'tenses', name: 'Tenses', emoji: '⏰' },
    { id: 'formality', name: 'Formality', emoji: '👔' }
  ];

  const filteredTopics = selectedCategory === 'all' 
    ? grammarTopics 
    : grammarTopics.filter(t => t.category === selectedCategory);

  if (!currentTopic) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => router.push('/learn/english/levels')}
            className="mb-6 px-6 py-3 bg-white shadow-lg hover:shadow-xl text-gray-700 font-semibold rounded-xl transition"
          >
            ← Back to Levels
          </button>
          
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            📚 Complete English Grammar Guide
          </h1>
          <p className="text-xl text-gray-600">
            From Basic to Royal English - Comprehensive Learning
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-3 rounded-xl font-semibold transition ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:shadow-lg'
              }`}
            >
              {cat.emoji} {cat.name}
            </button>
          ))}
        </div>

        {/* Topics Grid */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {filteredTopics.map(topic => (
            <button
              key={topic.id}
              onClick={() => setCurrentTopic(topic)}
              className={`p-4 rounded-xl text-left transition ${
                currentTopic.id === topic.id
                  ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-xl scale-105'
                  : 'bg-white hover:shadow-lg'
              }`}
            >
              <div className="text-3xl mb-2">{topic.emoji}</div>
              <div className={`font-bold mb-1 ${currentTopic.id === topic.id ? 'text-white' : 'text-gray-800'}`}>
                {topic.title}
              </div>
              <div className={`text-sm ${currentTopic.id === topic.id ? 'text-white/90' : 'text-gray-600'}`}>
                {topic.level}
              </div>
            </button>
          ))}
        </div>

        {/* Current Topic Content */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Topic Header */}
          <div className="text-center mb-8">
            <div className="text-7xl mb-4">{currentTopic.emoji}</div>
            <h2 className="text-4xl font-bold text-gray-800 mb-2">{currentTopic.title}</h2>
            <div className="inline-block bg-purple-100 text-purple-700 px-4 py-1 rounded-full text-sm font-semibold">
              {currentTopic.level} level
            </div>
          </div>

          {/* Explanation */}
          <div className="bg-blue-50 rounded-2xl p-6 mb-8">
            <h3 className="font-bold text-xl text-gray-800 mb-3">📖 Explanation:</h3>
            <p className="text-gray-700 text-lg leading-relaxed">{currentTopic.explanation}</p>
          </div>

          {/* Rules */}
          <div className="bg-green-50 rounded-2xl p-6 mb-8">
            <h3 className="font-bold text-xl text-gray-800 mb-4">📋 Rules & Formulas:</h3>
            <ul className="space-y-3">
              {currentTopic.rules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="bg-green-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-gray-700 text-lg">{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Examples */}
          <div className="mb-8">
            <h3 className="font-bold text-xl text-gray-800 mb-4">✨ Examples:</h3>
            <div className="space-y-4">
              {currentTopic.examples.map((example, idx) => (
                <div key={idx} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
                  <div className="grid md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">🇬🇧 English:</div>
                      <div className="text-lg font-semibold text-gray-800">{example.english}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">🇮🇩 Indonesian:</div>
                      <div className="text-lg text-gray-700">{example.indonesian}</div>
                    </div>
                  </div>
                  {example.formality && (
                    <div className="mb-2">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        example.formality === 'informal' ? 'bg-green-100 text-green-700' :
                        example.formality === 'neutral' ? 'bg-blue-100 text-blue-700' :
                        example.formality === 'formal' ? 'bg-purple-100 text-purple-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {example.formality.toUpperCase()}
                      </span>
                    </div>
                  )}
                  {example.note && (
                    <div className="bg-white rounded-lg p-3">
                      <span className="text-sm text-gray-600">💡 Note: {example.note}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Exercises */}
          <div className="mb-8">
            <h3 className="font-bold text-xl text-gray-800 mb-4">✏️ Practice Exercises:</h3>
            {currentTopic.exercises.map((exercise, idx) => (
              <div key={idx} className="bg-yellow-50 rounded-xl p-6 mb-4">
                <div className="font-semibold text-gray-800 mb-3">
                  {idx + 1}. {exercise.question}
                </div>
                <div className="bg-green-100 border-2 border-green-300 rounded-lg p-4 mb-2">
                  <span className="font-bold text-green-700">✓ Answer: </span>
                  <span className="text-gray-800 font-semibold">{exercise.answer}</span>
                </div>
                {exercise.explanation && (
                  <div className="text-sm text-gray-600 italic">
                    💡 {exercise.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Tips */}
          <div className="bg-orange-50 rounded-2xl p-6">
            <h3 className="font-bold text-xl text-gray-800 mb-4">💡 Pro Tips:</h3>
            <ul className="space-y-3">
              {currentTopic.tips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-orange-500 text-xl flex-shrink-0">★</span>
                  <span className="text-gray-700 text-lg">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Practice Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/learn/english/practice?level=1')}
            className="bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold px-12 py-5 rounded-xl hover:shadow-2xl transform hover:scale-105 transition text-xl"
          >
            🎯 Start Practice Quiz
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ComprehensiveGrammarPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-gray-700 text-2xl">Loading grammar guide...</div>
      </div>
    }>
      <ComprehensiveGrammarContent />
    </Suspense>
  );
}