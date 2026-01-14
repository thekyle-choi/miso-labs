import { useState, useEffect, useRef } from 'react';

/**
 * 텍스트 스트리밍을 부드러운 타이핑 효과로 변환하는 훅
 * @param targetText 최종적으로 보여줄 전체 텍스트
 * @param speed 타이핑 속도 (ms), 낮을수록 빠름
 * @returns 현재 보여줄 텍스트
 */
export function useSmoothStream(targetText: string, speed: number = 10) {
    const [displayedText, setDisplayedText] = useState('');
    // 애니메이션을 위한 ref
    const currentTextRef = useRef('');

    useEffect(() => {
        // 텍스트가 완전히 비워진 경우 (새로 시작)
        if (!targetText) {
            setDisplayedText('');
            currentTextRef.current = '';
            return;
        }

        let animationFrameId: number;

        const animate = () => {
            const currentLength = currentTextRef.current.length;
            const targetLength = targetText.length;

            // 이미 다 보여줬으면 종료
            if (currentLength === targetLength) {
                return;
            }

            // 목표 텍스트가 줄어든 경우 (오류 상황 등) 바로 맞춤
            if (currentLength > targetLength) {
                currentTextRef.current = targetText;
                setDisplayedText(targetText);
                return;
            }

            // 렌더링할 글자 수 계산 (거리에 따라 가속)
            const distance = targetLength - currentLength;

            // 거리가 멀면 더 많이, 가까우면 적게 (부드러운 가속)
            // 최소 1글자, 거리가 50자 이상이면 빨라짐
            let step = 1;
            if (distance > 100) step = 5;
            else if (distance > 50) step = 3;
            else if (distance > 20) step = 2;

            // 다음 텍스트 설정
            const nextText = targetText.slice(0, currentLength + step);
            currentTextRef.current = nextText;
            setDisplayedText(nextText);

            // 다음 프레임 요청
            // 속도 조절을 위해 setTimeout 대신 requestAnimationFrame 사용하되
            // 너무 빠르면 throttle 할 수 있음. 여기서는 RAF로 부드럽게 처리
            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [targetText]);

    return displayedText;
}
