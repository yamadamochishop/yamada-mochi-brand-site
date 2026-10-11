'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

// PCは16:9、スマホは9:16の別編集。どちらも実物のせいろの写真から始まる。
// ポスターはPC版の最初のフレームで、スマホでは中央が切り出されるため、
// スマホ版も近い画角から始めている。ポスターは1枚で足りる。
const videos = {
  desktop: '/videos/hero-pc-v6.mp4',
  mobile: '/videos/hero-sp-v6.mp4',
} as const;
const poster = '/images/hero-poster-seiro-pc.jpg';

// Tailwind の md と同じ境目。
const desktopQuery = '(min-width: 768px)';

type Variant = keyof typeof videos;

// Network Information API は一部のブラウザにしかないため、使う部分だけ型を書く。
type NetworkInformationLike = EventTarget & { saveData?: boolean };

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [variant, setVariant] = useState<Variant | null>(null);
  const [motionAllowed, setMotionAllowed] = useState(false);
  // 再生が始まった動画。動画が作り直されたら（画面幅の切り替え・設定の解除）、
  // 再生が始まるまでポスターを見せる。
  const [playingVariant, setPlayingVariant] = useState<Variant | null>(null);
  const [renderedKey, setRenderedKey] = useState<Variant | null>(null);
  const [userPaused, setUserPaused] = useState(false);
  const [failed, setFailed] = useState(false);

  // 画面幅で動画を選び、動きを減らす設定・データセーバーでは静止画のままにする。
  // どれも途中で変わりうるため、変更を購読する。
  useEffect(() => {
    const desktop = window.matchMedia(desktopQuery);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & { connection?: NetworkInformationLike })
      .connection;
    const update = () => {
      setVariant(desktop.matches ? 'desktop' : 'mobile');
      setMotionAllowed(!reduceMotion.matches && connection?.saveData !== true);
    };
    update();
    desktop.addEventListener('change', update);
    reduceMotion.addEventListener('change', update);
    connection?.addEventListener?.('change', update);
    return () => {
      desktop.removeEventListener('change', update);
      reduceMotion.removeEventListener('change', update);
      connection?.removeEventListener?.('change', update);
    };
  }, []);

  // 自動再生の制限・省電力モード・非対応形式など、本当に再生できないときだけ静止画に戻す。
  // 一時停止や動画の切り替えで再生要求が中断された場合（AbortError）と、
  // すでに差し替わった古い動画の結果は無視する。
  const tryPlay = useCallback((video: HTMLVideoElement) => {
    video.play().catch((error: unknown) => {
      if (videoRef.current !== video) return;
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setFailed(true);
    });
  }, []);

  // 再生はここだけで始める（autoPlay属性は使わない）。画面外では止めて端末の負荷を抑え、
  // 利用者が止めた場合は、画面幅で動画が切り替わっても再開しない。
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) video.pause();
      else if (!userPaused) tryPlay(video);
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, [variant, motionAllowed, userPaused, tryPlay]);

  const showVideo = motionAllowed && variant !== null && !failed;

  // 動画が作り直されるたびに表示状態を戻す。effectで戻すと、作り直した直後の描画で
  // 古い状態のまま不透明になるため、描画中に調整する（Reactが推奨する書き方）。
  const videoKey = showVideo ? variant : null;
  if (videoKey !== renderedKey) {
    setRenderedKey(videoKey);
    setPlayingVariant(null);
  }

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      setUserPaused(false);
      tryPlay(video);
    } else {
      setUserPaused(true);
      video.pause();
    }
  };

  return (
    <div className="absolute inset-0">
      {/* 見出しとコピーが同じ内容を伝えるため、背景は装飾として alt を空にする。 */}
      <Image
        src={poster}
        alt=""
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="object-cover"
      />
      {showVideo && (
        <video
          key={variant}
          ref={videoRef}
          src={videos[variant]}
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          onPlaying={() => setPlayingVariant(variant)}
          onError={() => setFailed(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${playingVariant === variant ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
      {showVideo && (
        <button
          type="button"
          onClick={togglePlayback}
          aria-label={userPaused ? '背景動画を再生' : '背景動画を一時停止'}
          className="absolute bottom-5 right-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-sumi/30 text-white/90 transition-colors hover:bg-sumi/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-base md:bottom-8 md:right-8"
        >
          {userPaused ? (
            <svg viewBox="0 0 16 16" aria-hidden="true" className="ml-0.5 h-4 w-4 fill-current">
              <path d="M4 2.5v11l9-5.5z" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4 fill-current">
              <path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}
