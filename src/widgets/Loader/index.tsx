import './index.css';
import { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import PayroLoaderAnimation from '../../animations/PayroLoaderAnimation.json';

interface LoaderProps {
  message?: string;
  countdown?: boolean;
  fullPageLoader?: boolean;
}

export default (props: LoaderProps) => {
  const animationContainer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (animationContainer.current) {
      lottie.loadAnimation({
        container: animationContainer.current,
        animationData: PayroLoaderAnimation,
        renderer: 'svg',
        loop: true,
        autoplay: true,
      });
    }
  }, [animationContainer]);
  return (
    <div id={props.fullPageLoader ? 'full-page-loader-wrapper' : ''}>
      <div className={'loader-wrapper'}>
        <div
          className={
            props.fullPageLoader
              ? 'full-page-loader-wrapper-content'
              : ''
          }
        >
          <div className="spinner" ref={animationContainer}></div>
          <h3 className="loader-message">{props.message}</h3>
        </div>{' '}
      </div>
    </div>
  );
};
