import { useState } from 'react'
import { ArrowRight, Check, Lightbulb, RotateCcw, X } from 'lucide-react'
import GlassCard from './GlassCard'

// Three-question check at the bottom of each topic page.
// questions: [{ question, options: [string], answer: index, explain, hint }]
function TopicQuiz({
  kicker = 'Quick check',
  title,
  description,
  questions,
  accentClass = 'bg-bark text-cream',
}) {
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const question = questions[index]
  const answered = picked !== null
  const isLast = index === questions.length - 1

  const pick = (choice) => {
    if (answered) return
    setPicked(choice)
    if (choice === question.answer) setScore((current) => current + 1)
  }

  const next = () => {
    if (isLast) {
      setFinished(true)
      return
    }
    setIndex((current) => current + 1)
    setPicked(null)
  }

  const restart = () => {
    setIndex(0)
    setPicked(null)
    setScore(0)
    setFinished(false)
  }

  return (
    <GlassCard as="section" aria-labelledby="quiz-heading" className="space-y-5 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-extrabold text-bark/60">{kicker}</p>
          <h2 id="quiz-heading" className="mt-1 font-heading text-3xl font-semibold">
            {title}
          </h2>
          <p className="mt-1 max-w-xl text-bark/80">{description}</p>
        </div>
        {!finished && (
          <span className={`rounded-full px-4 py-1.5 text-sm font-extrabold ${accentClass}`}>
            {index + 1} / {questions.length}
          </span>
        )}
      </div>

      {finished ? (
        <div className="animate-pop flex h-[16rem] flex-col items-center justify-center rounded-3xl border border-hairline/70 bg-surface/70 p-6 text-center motion-reduce:animate-none">
          <p className="font-heading text-2xl font-semibold">
            {score} of {questions.length} correct
          </p>
          <p className="mt-2 text-bark/80">
            {score === questions.length
              ? 'Perfect score. You could teach this one.'
              : score >= questions.length - 1
                ? 'Almost there. One more read and it is yours.'
                : 'Good start. The field guide has the answers.'}
          </p>
          <button
            type="button"
            onClick={restart}
            className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-bark px-5 font-bold text-cream transition hover:-translate-y-0.5"
          >
            <RotateCcw size={18} />
            Try again
          </button>
        </div>
      ) : (
        <div className="flex h-[16rem] flex-col">
          <p className="text-lg font-bold">{question.question}</p>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {question.options.map((option, i) => {
              const isPicked = picked === i
              const isAnswer = question.answer === i
              const tone = !answered
                ? 'glass hover:bg-surface/70'
                : isAnswer
                  ? 'border-leaf-600 bg-leaf-100 text-leaf-700'
                  : isPicked
                    ? 'border-[#d16b5a] bg-[#fbe6e1] text-[#a8412f] dark:bg-[#3a1c1f] dark:text-[#fca5a5]'
                    : 'glass opacity-60'
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => pick(i)}
                  disabled={answered}
                  className={`flex min-h-14 items-center justify-between gap-3 rounded-2xl border-2 border-transparent px-4 py-3 text-left font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600 enabled:hover:-translate-y-0.5 ${tone}`}
                >
                  {option}
                  {answered && isAnswer && <Check size={18} className="flex-none" />}
                  {answered && isPicked && !isAnswer && <X size={18} className="flex-none" />}
                </button>
              )
            })}
          </div>

          <div className="mt-4 flex flex-1 flex-col justify-end gap-3">
            {answered ? (
              <>
                <p
                  aria-live="polite"
                  className="animate-pop leading-relaxed text-bark/80 motion-reduce:animate-none"
                >
                  <span className="font-extrabold">
                    {picked === question.answer ? 'Correct. ' : 'Not quite. '}
                  </span>
                  {question.explain}
                </p>
                <button
                  type="button"
                  onClick={next}
                  className="inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-bark px-5 font-bold text-cream transition hover:-translate-y-0.5"
                >
                  {isLast ? 'See result' : 'Next question'}
                  <ArrowRight size={18} />
                </button>
              </>
            ) : (
              question.hint && (
                <div className="flex items-start gap-3 rounded-2xl border border-hairline/60 bg-surface/50 px-4 py-3">
                  <Lightbulb size={17} className="mt-0.5 flex-none text-bark/40" />
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-wide text-bark/40">
                      How to think about it
                    </p>
                    <p className="mt-0.5 text-sm leading-relaxed text-bark/60">{question.hint}</p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </GlassCard>
  )
}

export default TopicQuiz

