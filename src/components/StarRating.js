import { useState } from 'react';

function StarRating({ maxRating = 10, color = '#fcc419', size = 24, onSetRating }) {

    const [rating, setRating] = useState(1);
    const [tempRating, setTempRating] = useState(0);
    const containerStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
    };

    const starContainerStyle = {
        display: 'flex',
    };
    const textStyle = {
        lineHeight: "1",
        margin: "0",
        color,
        fontSize: `${size / 1.5}px`
    };

    function onHoverIn(i) {
        setTempRating(i + 1);
    }
    function onHoverOut() {
        setTempRating(0);
    }
    return (
        <div style={containerStyle}>
            <div style={starContainerStyle}>
                {
                    Array.from({ length: maxRating }, (_, i) => <Star
                        color={color}
                        size={size}
                        onHoverOut={onHoverOut}
                        onHoverIn={() => onHoverIn(i)}
                        full={tempRating ? (i + 1) <= tempRating : (i + 1) <= rating}
                        onClick={() => {
                            const newRating = i + 1;
                            setRating(newRating);
                            if (onSetRating) {
                                onSetRating(newRating); // Pass the newRating value to onSetRating
                            }
                        }}
                        key={i} />)
                }
            </div>
            <p style={textStyle}>{rating || ''}</p>
        </div>
    );

}

function Star({ onClick, full, onHoverIn, onHoverOut, color, size }) {
    const starStyle = {
        width: `${size}px`,
        height: `${size}px`,
        cursor: 'pointer',
        display: 'block'
    };
    return (
        <>
            <span onMouseLeave={onHoverOut} onMouseEnter={onHoverIn} onClick={onClick} role='button' style={starStyle}>

                {full ? <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill={color}
                    stroke={color}
                >
                    <path
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                    />
                </svg> : <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke={color}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="{2}"
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                </svg>
                }

            </span>



        </>



    );

}

export default StarRating;