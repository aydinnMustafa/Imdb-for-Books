import { useCallback } from "react";
import Particles from "react-particles";
import { loadFull } from "tsparticles";

const ParticlesBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {}, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={{
        fullScreen: {
          enable: true,
          zIndex: -1,
        },
        detectRetina: true,
        fpsLimit: 120,
        particles: {
          color: {
            value: "#21cc89",
          },
          lineLinked: {
            blink: false,
            color: "#FFFFFF",
            consent: false,
            distance: 150,
            enable: false,
            opacity: 0.4,
            width: 0.5,
          },
          move: {
            attract: {
              enable: false,
              rotate: {
                x: 600,
                y: 1200,
              },
            },
            bounce: false,
            direction: "none",
            enable: true,
            outMode: "out",
            random: false,
            speed: 1,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            limit: 400,
            value: 8,
          },
          opacity: {
            animation: {
              enable: false,
              minimumValue: 0.1,
              speed: 1,
              sync: false,
            },
            random: false,
            value: 0.5,
          },
          shape: {
            type: "circle",
          },
          size: {
            animation: {
              enable: false,
              minimumValue: 0.1,
              speed: 40,
              sync: false,
            },
            random: false,
            value: 120,
          },
        },
        polygon: {
          draw: {
            enable: false,
            lineColor: "#ffffff",
            lineWidth: 0.5,
          },
          move: {
            radius: 10,
          },
          scale: 1,
          type: "none",
          url: "",
        },
      }}
    />
  );
};

export default ParticlesBackground;
