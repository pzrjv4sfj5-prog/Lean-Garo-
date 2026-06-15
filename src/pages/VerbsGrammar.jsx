import React, { useState } from 'react'

export default function VerbsGrammar() {
  const [selectedTab, setSelectedTab] = useState('verbs')
  const [selectedVerbRoot, setSelectedVerbRoot] = useState('cha·a')

  const verbRoots = {
    'cha·a': { en: 'eat', examples: ['cha·enga: (I am) eating', 'cha·aha: ate', 'cha·gen: will eat', 'cha·bo: Eat! (imperative)', 'cha·ja: does not eat'] },
    're·anga': { en: 'go', examples: ['re·angenga: (I am) going', 're·anga: went', 're·anggen: will go', 'Tusibo: Go to sleep! (imperative)', 're·ang-ja: does not go'] },
    'nik·a': { en: 'see', examples: ['nik·enga: (I am) seeing', 'nik·aha: saw', 'nik·gen: will see'] },
    'agan·a': { en: 'speak / say', examples: ['agan·enga: speaking', 'agan·aha: spoke', 'agan·gen: will speak'] },
    'on·a': { en: 'give', examples: ['on·enga: giving', 'on·aha: gave', 'on·gen: will give'] },
    'tusina': { en: 'sleep', examples: ['tusienga: (I am) sleeping', 'tusieaha: slept', 'tusibo: Sleep! (imperative)'] },
    'brea-na': { en: 'buy', examples: ['brea-enga: buying', 'brea-aha: bought', 'brea-gen: will buy'] },
  }

  const classifierRules = [
    {
      classifier: 'Mang-',
      use_for: 'Animals, Birds, Fish, Insects',
      examples: [
        'mang-sa achak (one dog)',
        'mang-gni achak (two dogs)',
        'mang-bonga do·o (five birds)'
      ]
    },
    {
      classifier: 'Sak-',
      use_for: 'People, Persons, Humans',
      examples: [
        'sak-sa mande (one person)',
        'sak-gni mande (two people)',
        'sak-gitam mande (three people)'
      ]
    },
    {
      classifier: 'Gong-',
      use_for: 'Money, Coins, Currency',
      examples: [
        'gong-sa tangka (one rupee)',
        'gong-gni tangka (two rupees)',
        'gong-bonga tangka (five rupees)'
      ]
    },
    {
      classifier: 'King-',
      use_for: 'Books, Paper, Leaves, Thin Objects',
      examples: [
        'king-sa ki·tap (one book)',
        'king-gni ki·tap (two books)',
        'king-gitam ki·tap (three books)'
      ]
    },
    {
      classifier: 'Ge',
      use_for: 'Objects, Things, Items, Tools, General Nouns',
      examples: [
        'Chokki sa·ge (one chair)',
        'Kettal gni·ge (two knives)',
        'Mez gittam·ge (three tables)'
      ]
    },
  ]

  const countingRules = [
    {
      title: 'Basic Numbers (1-10)',
      numbers: { 1: 'Sa', 2: 'Gni', 3: 'Gittam', 4: 'Bri', 5: 'Bonga', 6: 'Dok', 7: 'Sni', 8: 'Chet', 9: 'Sku', 10: 'Chiking' }
    },
    {
      title: 'Tens (20-90)',
      numbers: { 20: 'Kolgrik', 30: 'Kolatchi', 40: 'Sotbri', 50: 'Sotbonga', 60: 'Sotdok', 70: 'Sotsni', 80: 'Sotchet', 90: 'Sotsku' }
    },
    {
      title: 'Hundreds & Thousands',
      numbers: { 100: 'Ritchasa', 1000: 'Hajalsa' }
    }
  ]

  const grammarPoints = [
    {
      title: 'Sentence Structure',
      description: 'Garo follows SOV (Subject-Object-Verb) structure',
      example: 'Anga mi cha·enga = I rice eating',
      explanation: 'Subject (Anga) + Object (mi) + Verb (cha·enga)'
    },
    {
      title: 'Tense System',
      description: 'Tenses are marked by suffixes',
      examples: [
        'Present: -enga (cha·enga = eating)',
        'Past: -aha (cha·aha = ate)',
        'Future: -gen (cha·gen = will eat)'
      ]
    },
    {
      title: 'Classifiers',
      description: 'Nouns require appropriate classifiers when counted',
      example: 'Do·o mang-gni = two chickens (Noun + Classifier-Number)',
      note: 'Different noun categories use different classifiers'
    },
    {
      title: 'Pronouns',
      description: 'Personal and possessive pronouns are essential',
      examples: [
        'Anga = I, Angni = my',
        'Na·a = you, Nang·ni = your',
        'Ua = he/she, Uni = his/her'
      ]
    },
    {
      title: 'Negation',
      description: 'Negation is typically expressed with -ba or -ja',
      example: 'Anga u·ija = I don\'t know',
      note: '-ja suffix indicates negative'
    },
    {
      title: 'Compound Words',
      description: 'Two or more words create new meanings',
      examples: [
        'Rasin-gipok = garlic (literal: onion-white)',
        'Do·bit = hen (literal: bird classifier)',
      ]
    },
  ]

  const pronouns = [
    { english: 'I', garo: 'Anga', possessive: 'Angni' },
    { english: 'You (singular)', garo: 'Na·a', possessive: 'Nang·ni' },
    { english: 'He/She', garo: 'Ua', possessive: 'Uni' },
    { english: 'We (excl.)', garo: 'Chinga', possessive: 'Chingni' },
    { english: 'We (incl.)', garo: 'An·ching', possessive: 'An·chingni' },
    { english: 'You (plural)', garo: 'Uamang-na', possessive: 'Uamang-ni' },
    { english: 'They', garo: 'Uamang', possessive: 'Uamangni' },
  ]

  return (
    <div className="py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">📖 Verbs & Grammar</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Comprehensive guide to Garo language structure, verbs, and grammatical rules
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        {['verbs', 'classifiers', 'counting', 'grammar', 'pronouns'].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-6 py-3 font-semibold transition-colors capitalize whitespace-nowrap ${
              selectedTab === tab
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Verbs Tab */}
      {selectedTab === 'verbs' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {Object.entries(verbRoots).map(([root, data]) => (
              <button
                key={root}
                onClick={() => setSelectedVerbRoot(root)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedVerbRoot === root
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                    : 'border-gray-200 dark:border-gray-600 hover:border-blue-300'
                }`}
              >
                <div className="font-bold text-lg text-gray-900 dark:text-white">{root}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{data.en}</div>
              </button>
            ))}
          </div>

          {verbRoots[selectedVerbRoot] && (
            <div className="card dark:bg-gray-800 dark:border-gray-700">
              <h3 className="text-2xl font-bold mb-4">
                {selectedVerbRoot} ({verbRoots[selectedVerbRoot].en})
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['Present Continuous', 'Past Tense', 'Future Tense'].map((tense, idx) => (
                  <div key={tense} className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900 border border-purple-200 dark:border-purple-700">
                    <h4 className="font-bold text-purple-900 dark:text-purple-100 mb-3">
                      {tense}
                    </h4>
                    <p className="text-lg font-mono font-bold text-purple-700 dark:text-purple-300">
                      {verbRoots[selectedVerbRoot].examples[idx]}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700">
                <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-2">Conjugation Pattern</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  Root: {selectedVerbRoot}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mt-1">
                  + -enga (present continuous)
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  + -aha (past tense)
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  + -gen (future tense)
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Classifiers Tab */}
      {selectedTab === 'classifiers' && (
        <div className="space-y-6">
          <div className="card dark:bg-gray-800 dark:border-gray-700 bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700">
            <h3 className="font-bold text-lg mb-3 text-blue-900 dark:text-blue-100">
              📌 What are Classifiers?
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              Garo uses classifiers (also called counters) when expressing quantities. Classifiers are attached after the number and before or after the noun, depending on the sentence structure.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Basic Structure:</strong> [Classifier] + [Number] + [Noun]
            </p>
          </div>

          {classifierRules.map((rule, idx) => (
            <div key={idx} className="card dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {rule.classifier}
                </span>
                <div>
                  <h3 className="font-bold text-lg">{rule.use_for}</h3>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-2">
                {rule.examples.map((example, i) => (
                  <div key={i} className="p-2 rounded bg-blue-50 dark:bg-blue-900 text-gray-900 dark:text-white font-mono text-sm">
                    <span className="text-blue-600 dark:text-blue-300">Classifier.Number → </span>
                    {example}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Counting Tab */}
      {selectedTab === 'counting' && (
        <div className="space-y-6">
          <div className="card dark:bg-gray-800 dark:border-gray-700 bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700">
            <h3 className="font-bold text-lg mb-3 text-green-900 dark:text-green-100">
              🔢 Garo Number System
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              Garo numbers follow a systematic pattern. Compound numbers are created by combining base numbers with tens.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
              ✓ Classifier Structure: <span className="font-mono">Classifier + Number</span> (e.g., Mang.Sa not Sa.Mang)
            </p>
          </div>

          {countingRules.map((rule, idx) => (
            <div key={idx} className="card dark:bg-gray-800 dark:border-gray-700">
              <h3 className="font-bold text-lg mb-4">{rule.title}</h3>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {Object.entries(rule.numbers).map(([num, garo]) => (
                  <div
                    key={num}
                    className="p-3 rounded-lg bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 text-center"
                  >
                    <div className="font-bold text-green-900 dark:text-green-100">
                      {num}
                    </div>
                    <div className="font-mono text-green-700 dark:text-green-400 text-sm">
                      {garo}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="card dark:bg-gray-800 dark:border-gray-700">
            <h3 className="font-bold text-lg mb-4">📋 Compound Number Examples</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[21, 25, 32, 45, 67, 89].map((num) => (
                <div key={num} className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700">
                  <div className="font-bold text-gray-900 dark:text-white">{num}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Example: [base 20/30/etc] + [1-9]
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Grammar Tab */}
      {selectedTab === 'grammar' && (
        <div className="space-y-6">
          {grammarPoints.map((point, idx) => (
            <div key={idx} className="card dark:bg-gray-800 dark:border-gray-700">
              <h3 className="text-xl font-bold mb-2 text-blue-600 dark:text-blue-400">
                {point.title}
              </h3>

              <p className="text-gray-700 dark:text-gray-300 mb-3">
                {point.description}
              </p>

              {point.example && (
                <div className="mb-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Example:</div>
                  <div className="font-mono font-bold text-gray-900 dark:text-white">
                    {point.example}
                  </div>
                </div>
              )}

              {point.explanation && (
                <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                  {point.explanation}
                </div>
              )}

              {point.examples && (
                <div className="space-y-2">
                  {point.examples.map((ex, i) => (
                    <div
                      key={i}
                      className="p-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                    >
                      • {ex}
                    </div>
                  ))}
                </div>
              )}

              {point.note && (
                <div className="mt-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 text-sm">
                  <strong>Note:</strong> {point.note}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pronouns Tab */}
      {selectedTab === 'pronouns' && (
        <div className="space-y-6">
          <div className="card dark:bg-gray-800 dark:border-gray-700 bg-purple-50 dark:bg-purple-900 border-purple-200 dark:border-purple-700">
            <h3 className="font-bold text-lg mb-3 text-purple-900 dark:text-purple-100">
              👤 Pronouns are Essential in Garo
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Garo distinguishes between inclusive and exclusive &quot;we&quot;, and has separate forms for objects and possessives.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                  <th className="text-left py-3 px-4 font-bold">English</th>
                  <th className="text-left py-3 px-4 font-bold">Subject Pronoun</th>
                  <th className="text-left py-3 px-4 font-bold">Possessive</th>
                </tr>
              </thead>
              <tbody>
                {pronouns.map((p, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="py-4 px-4 font-semibold text-gray-900 dark:text-white">
                      {p.english}
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-purple-600 dark:text-purple-400">
                      {p.garo}
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {p.possessive}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card dark:bg-gray-800 dark:border-gray-700">
                <h4 className="font-bold text-lg mb-3">Inclusive vs Exclusive &quot;We&quot;</h4>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900">
                  <div className="font-bold text-blue-900 dark:text-blue-100">Exclusive (Chinga)</div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    We (you are not included)
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900">
                  <div className="font-bold text-green-900 dark:text-green-100">Inclusive (An·ching)</div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    We (you are included)
                  </div>
                </div>
              </div>
            </div>

            <div className="card dark:bg-gray-800 dark:border-gray-700">
              <h4 className="font-bold text-lg mb-3">Usage Example</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-mono font-bold text-purple-600 dark:text-purple-400">Anga uia</span>
                  <div className="text-gray-600 dark:text-gray-400">I know</div>
                </div>
                <div>
                  <span className="font-mono font-bold text-purple-600 dark:text-purple-400">Angni nok</span>
                  <div className="text-gray-600 dark:text-gray-400">My house</div>
                </div>
                <div>
                  <span className="font-mono font-bold text-purple-600 dark:text-purple-400">Na·a re·enga</span>
                  <div className="text-gray-600 dark:text-gray-400">You are walking</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
