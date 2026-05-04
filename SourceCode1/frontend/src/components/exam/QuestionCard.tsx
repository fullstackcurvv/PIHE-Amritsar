import type { Question } from '@/types/exam'

interface QuestionCardProps {
  question: Question
  index: number
  selectedOption?: string
  answerText?: string
  onOptionSelect: (optionId: string) => void
  onTextChange: (text: string) => void
}

export function QuestionCard({
  question,
  index,
  selectedOption,
  answerText,
  onOptionSelect,
  onTextChange,
}: QuestionCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      {/* Question header */}
      <div className="flex items-start gap-3 mb-6">
        <span
          className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
          style={{ backgroundColor: '#E8720C' }}
        >
          {index + 1}
        </span>
        <p className="text-gray-800 font-medium text-base leading-relaxed">{question.text}</p>
      </div>

      {/* MCQ options */}
      {question.type === 'mcq' && question.options && (
        <div className="space-y-3">
          {question.options.map((option) => {
            const isSelected = selectedOption === option._id
            return (
              <button
                key={option._id}
                onClick={() => onOptionSelect(option._id)}
                className={`
                  w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left
                  transition-all duration-200 hover:border-[#E8720C]
                  ${isSelected
                    ? 'border-[#E8720C] bg-orange-50'
                    : 'border-gray-200 bg-white hover:bg-orange-50/30'
                  }
                `}
              >
                <span
                  className={`
                    w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center
                    transition-all duration-200
                    ${isSelected ? 'border-[#E8720C]' : 'border-gray-300'}
                  `}
                >
                  {isSelected && (
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: '#E8720C' }}
                    />
                  )}
                </span>
                <span className={`text-sm ${isSelected ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                  {option.text}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* Short answer */}
      {question.type === 'short' && (
        <input
          type="text"
          value={answerText ?? ''}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Write your short answer here..."
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#E8720C] focus:outline-none text-sm transition-colors"
        />
      )}

      {/* Long answer */}
      {question.type === 'long' && (
        <textarea
          value={answerText ?? ''}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Write your detailed answer here..."
          rows={6}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#E8720C] focus:outline-none text-sm transition-colors resize-none"
        />
      )}

      {/* Marks */}
      <div className="mt-4 flex justify-end">
        <span className="text-xs text-gray-400">{question.marks} mark{question.marks > 1 ? 's' : ''}</span>
      </div>
    </div>
  )
}
