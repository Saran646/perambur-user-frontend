'use client'

interface EmojiRatingProps {
    rating: number
    onChange: (rating: number) => void
    size?: 'sm' | 'md' | 'lg'
    readOnly?: boolean
}

export default function EmojiRating({ rating, onChange, size = 'md', readOnly = false }: EmojiRatingProps) {
    const emojis = [
        { value: 1, symbol: '😠', label: 'Angry' },
        { value: 2, symbol: '☹️', label: 'Unhappy' },
        { value: 3, symbol: '😐', label: 'Neutral' },
        { value: 4, symbol: '🙂', label: 'Happy' },
        { value: 5, symbol: '😍', label: 'Loved it' },
    ]

    const sizeClasses = {
        sm: 'text-2xl gap-2',
        md: 'text-4xl gap-4',
        lg: 'text-5xl gap-6',
    }

    return (
        <div className={`flex ${sizeClasses[size]}`}>
            {emojis.map((emoji) => (
                <button
                    key={emoji.value}
                    type="button"
                    onClick={() => !readOnly && onChange(emoji.value)}
                    disabled={readOnly}
                    className={`
                        transition-transform duration-200 hover:scale-125 focus:outline-none
                        ${readOnly ? 'cursor-default' : 'cursor-pointer'}
                        ${rating === emoji.value ? 'scale-125 grayscale-0' : 'grayscale opacity-50 hover:grayscale-0 hover:opacity-100'}
                    `}
                    title={emoji.label}
                >
                    {emoji.symbol}
                </button>
            ))}
        </div>
    )
}
