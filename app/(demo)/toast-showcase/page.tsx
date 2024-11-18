export default function AdvancedToastPlayground() {
  // ... other code remains the same

  const showToast = () => {
    const animationConfig = toastConfig.animation === 'custom' 
      ? { 
          initial: { opacity: 0, y: 50 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 50 },
          transition: { 
            duration: 0.5,
            ease: [customAnimation.x1, customAnimation.y1, customAnimation.x2, customAnimation.y2]
          }
        }
      : PREDEFINED_ANIMATIONS[toastConfig.animation as keyof typeof PREDEFINED_ANIMATIONS]

    if (!toastConfig.variant || !toastConfig.message) return;

    toast({
      message: toastConfig.message,
      description: toastConfig.title,
      variant: toastConfig.variant,
      position: toastConfig.position || "bottom-right",
      duration: toastConfig.duration,
      showProgress: toastConfig.showProgress,
      animation: toastConfig.animation
    });
  }

  // ... rest of the component remains the same
} 