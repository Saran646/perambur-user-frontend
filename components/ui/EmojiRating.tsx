'use client'

interface EmojiRatingProps {
    rating: number
    onChange: (rating: number) => void
    size?: 'sm' | 'md' | 'lg'
    readOnly?: boolean
}

export default function EmojiRating({ rating, onChange, size = 'md', readOnly = false }: EmojiRatingProps) {
    const emojis = [
        { value: 4, symbol: '😍', label: 'Love it' },
        { value: 3, symbol: '😊', label: 'Good' },
        { value: 2, symbol: '😐', label: 'Average' },
        { value: 1, symbol: '🙁', label: 'Poor' },
    ]

    const sizeClasses = {
        sm: 'text-xl sm:text-2xl gap-1 sm:gap-2',
        md: 'text-2xl sm:text-4xl gap-2 sm:gap-4',
        lg: 'text-3xl sm:text-5xl gap-2 sm:gap-6',
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
