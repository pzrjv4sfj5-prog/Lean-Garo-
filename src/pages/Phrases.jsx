import React, { useState } from 'react'

export default function Phrases() {
  const [selectedCategory, setSelectedCategory] = useState('greetings')

  const phraseCategories = {
    greetings: {
      emoji: '👋',
      title: 'Greetings & Politeness',
      phrases: [
        { en: 'Hello / Hello', garo: 'Salam', hi: 'नमस्ते', breakdown: 'Greeting expression' },
        { en: 'How are you?', garo: 'Na·a namengama?', hi: 'आप कैसे हैं?', breakdown: 'Polite inquiry' },
        { en: 'I am fine', garo: 'Anga namenga', hi: 'मैं ठीक हूं', breakdown: 'Response to greeting' },
        { en: 'Thank you', garo: 'Mitela', hi: 'धन्यवाद', breakdown: 'Expression of gratitude' },
        { en: 'Goodbye / See you', garo: 'Nam-en-dongbo', hi: 'अलविदा', breakdown: 'Farewell' },
        { en: 'Good morning', garo: 'Pringnam', hi: 'सुप्रभात', breakdown: 'Morning greeting' },
        { en: 'Good evening', garo: 'Attamnam', hi: 'शुभ संध्या', breakdown: 'Evening greeting' },
        { en: 'Good night', garo: 'Walnam', hi: 'शुभ रात्रि', breakdown: 'Night greeting' },
      ]
    },

    market: {
      emoji: '🛒',
      title: 'Market & Shopping',
      phrases: [
        { en: 'How much is this?', garo: 'Ia baita?', hi: 'यह कितना है?', breakdown: 'Price inquiry' },
        { en: 'It is too expensive', garo: 'Ia dam rakduga', hi: 'यह बहुत महंगा है', breakdown: 'Price complaint' },
        { en: 'Do you have mangoes?', garo: 'Nang·o am dong·a?', hi: 'क्या आपके पास आम हैं?', breakdown: 'Item inquiry' },
        { en: 'Give me a discount', garo: 'Dam-ko on·tisa komiatbo', hi: 'मुझे छूट दें', breakdown: 'Negotiation' },
        { en: 'I want to buy this', garo: 'Anga iako brena ska', hi: 'मैं यह खरीदना चाहता हूং', breakdown: 'Purchase intent' },
        { en: 'How many?', garo: 'Bako?', hi: 'कितने?', breakdown: 'Quantity inquiry' },
      ]
    },

    travel: {
      emoji: '✈️',
      title: 'Travel & Directions',
      phrases: [
        { en: 'Where is the station?', garo: 'Nengtakani biap bano?', hi: 'रेलवे स्टेशन कहां है?', breakdown: 'Location inquiry' },
        { en: 'Which way is the school?', garo: 'Skul bano-ni rama?', hi: 'स्कूल किस रास्ते है?', breakdown: 'Direction inquiry' },
        { en: 'How far is it?', garo: 'Ia chel·a?', hi: 'यह कितनी दूरी है?', breakdown: 'Distance inquiry' },
        { en: 'Can I go by bus?', garo: 'Anga bus-o re·angode ska?', hi: 'क्या मैं बस से जा सकता हूं?', breakdown: 'Transport inquiry' },
        { en: 'Go straight ahead', garo: 'Mikkang re·angbo', hi: 'सीधे आगे बढ़ें', breakdown: 'Direction command' },
        { en: 'Turn left', garo: 'Jak-asi tu·a-bo', hi: 'बाएं मुड़ें', breakdown: 'Direction command' },
      ]
    },

    hospital: {
      emoji: '🏥',
      title: 'Hospital & Health',
      phrases: [
        { en: 'I have a headache', garo: 'Angni sko sa·dika', hi: 'मुझे सिरदर्द है', breakdown: 'Symptom description' },
        { en: 'Take this medicine', garo: 'Ia sam ra·bo', hi: 'यह दवा लें', breakdown: 'Medical instruction' },
        { en: 'He has a fever', garo: 'Uni sin·-ding·-a', hi: 'उसे बुखार है', breakdown: 'Symptom description' },
        { en: 'I am sick', garo: 'Anga sakama', hi: 'मैं बीमार हूं', breakdown: 'Health status' },
        { en: 'Call the doctor', garo: 'Doctor sa·sak kol-bo', hi: 'डॉक्टर को बुलाएं', breakdown: 'Request action' },
      ]
    },

    school: {
      emoji: '🎓',
      title: 'School & Education',
      phrases: [
        { en: 'What is this lesson?', garo: 'Ia porani maia?', hi: 'यह पाठ क्या है?', breakdown: 'Lesson inquiry' },
        { en: 'Write the answer', garo: 'Aganchakani se·bo', hi: 'उत्तर लिखें', breakdown: 'Instruction' },
        { en: 'The exam is tomorrow', garo: 'Porika knal', hi: 'परीक्षा कल है', breakdown: 'Schedule information' },
        { en: 'I do not understand', garo: 'Anga u·ija', hi: 'मैं नहीं समझता', breakdown: 'Comprehension issue' },
        { en: 'Can you repeat that?', garo: 'Pil·tai agan·bo?', hi: 'क्या आप फिर से कह सकते हैं?', breakdown: 'Clarification request' },
      ]
    },

    family: {
      emoji: '👨‍👩‍👧‍👦',
      title: 'Family & Home',
      phrases: [
        { en: 'This is my mother', garo: 'Ia angni ma', hi: 'यह मेरी माताजी हैं', breakdown: 'Introduction' },
        { en: 'Where is your father?', garo: 'Nang·ni pa bano?', hi: 'आपके पिता जी कहां हैं?', breakdown: 'Location inquiry' },
        { en: 'I have two brothers', garo: 'Angni ada gni·sak dong·a', hi: 'मेरे दो भाई हैं', breakdown: 'Family description' },
        { en: 'My sister is studying', garo: 'Angni abi poral enga', hi: 'मेरी बहन पढ़ रही है', breakdown: 'Activity description' },
        { en: 'Come to my house', garo: 'Angni nok-o re·ba-bo', hi: 'मेरे घर आओ', breakdown: 'Invitation' },
      ]
    },

    emotions: {
      emoji: '😊',
      title: 'Emotions & Feelings',
      phrases: [
        { en: 'I love you', garo: 'Anga nang·na ka·saa', hi: 'मैं आपसे प्यार करता हूं', breakdown: 'Expression of love' },
        { en: 'I am very happy', garo: 'Anga be·en kusi', hi: 'मैं बहुत खुश हूं', breakdown: 'Expression of joy' },
        { en: 'Do not be afraid', garo: 'Kenani ong·ja', hi: 'डर मत लगो', breakdown: 'Reassurance' },
        { en: 'I am sorry', garo: 'Kema-bi·a', hi: 'मुझे खेद है', breakdown: 'Expression of regret' },
        { en: 'Are you angry?', garo: 'Na·a ka·o nanga?', hi: 'क्या आप नाराज़ हैं?', breakdown: 'Emotional inquiry' },
      ]
    },

    cultural: {
      emoji: '🎉',
      title: 'Cultural & Festive',
      phrases: [
        { en: 'Happy Wangala!', garo: 'Wangala sakadok!', hi: 'वांगला की खुशियाँ!', breakdown: 'Festival greeting' },
        { en: 'The festival is coming', garo: 'Sokra knal re·bagen', hi: 'त्योहार आने वाला है', breakdown: 'Festival anticipation' },
        { en: 'Let us celebrate together', garo: 'An·ching baksa sakdok-bo', hi: 'आइए साथ मनाएं', breakdown: 'Celebration invitation' },
        { en: 'This is our tradition', garo: 'Ia an·chi dakbewal', hi: 'यह हमारी परंपरा है', breakdown: 'Cultural reference' },
        { en: 'Dance with us!', garo: 'An·ching baksa kal·mang-bo!', hi: 'हमारे साथ नाचें!', breakdown: 'Activity invitation' },
      ]
    },

    request: {
      emoji: '🤝',
      title: 'Requests & Politeness',
      phrases: [
        { en: 'Please help me', garo: 'Ka·sapae Anga mang-na dak·bo', hi: 'कृपया मेरी मदद करें', breakdown: 'Help request' },
        { en: 'Can you give me water?', garo: 'Na·a angna chi on·ode ska?', hi: 'क्या मुझे पानी दे सकते हैं?', breakdown: 'Polite request' },
        { en: 'Excuse me', garo: 'Angko kema-watbo', hi: 'क्षमा करें', breakdown: 'Attention getting' },
        { en: 'May I sit down?', garo: 'Anga asong-ode ska?', hi: 'क्या मैं बैठ सकता हूं?', breakdown: 'Permission request' },
        { en: 'Do you understand?', garo: 'Na·a uia?', hi: 'क्या आप समझते हैं?', breakdown: 'Comprehension check' },
      ]
    }
  }

  const categories = Object.keys(phraseCategories)

  return (
    <div className="py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">💬 Phrases & Expressions</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Common phrases for daily conversation, travel, and cultural interactions
        </p>
      </div>

      {/* Category Selection */}
      <div className="card dark:bg-gray-800 dark:border-gray-700">
        <h2 className="text-lg font-bold mb-4">📂 Choose a Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => {
            const catData = phraseCategories[cat]
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedCategory === cat
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                    : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500'
                }`}
              >
                <div className="text-3xl mb-2">{catData.emoji}</div>
                <div className="font-bold text-gray-900 dark:text-white">
                  {catData.title}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Phrases Display */}
      {phraseCategories[selectedCategory] && (
        <div>
          <div className="mb-6">
            <div className="text-4xl mb-2">{phraseCategories[selectedCategory].emoji}</div>
            <h2 className="text-2xl font-bold">
              {phraseCategories[selectedCategory].title}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {phraseCategories[selectedCategory].phrases.map((phrase, idx) => (
              <div
                key={idx}
                className="card dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow"
              >
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">
                      English
                    </label>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {phrase.en}
                    </p>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                    <label className="text-xs font-bold text-green-600 dark:text-green-400 uppercase">
                      Garo
                    </label>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400 font-mono">
                      {phrase.garo}
                    </p>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                    <label className="text-xs font-bold text-yellow-600 dark:text-yellow-400 uppercase">
                      Hindi
                    </label>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {phrase.hi}
                    </p>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900 px-3 py-2 rounded text-sm text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-600 pt-3">
                    <span className="font-semibold">Context:</span> {phrase.breakdown}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="card dark:bg-gray-800 dark:border-gray-700 bg-yellow-50 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-700">
        <h3 className="text-lg font-bold mb-3">💡 Tips for Learning</h3>
        <ul className="space-y-2 text-gray-700 dark:text-gray-300">
          <li>✓ Practice pronunciation by repeating phrases out loud</li>
          <li>✓ Learn related phrases in the same category together</li>
          <li>✓ Context matters - use phrases in natural conversations</li>
          <li>✓ Cultural understanding enhances language learning</li>
          <li>✓ Respect local customs and traditions when visiting</li>
        </ul>
      </div>
    </div>
  )
}
