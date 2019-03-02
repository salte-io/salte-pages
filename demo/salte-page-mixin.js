export default function(superClass) {
  return class extends superClass {
    show(animate) {
      if (animate) {
        return this.animate([
          { opacity: 0 },
          { opacity: 1 }
        ], {
          duration: 1000,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        }).finished;
      }
    }

    hide() {
      return this.animate([
        { opacity: 1 },
        { opacity: 0 }
      ], {
        duration: 1000,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        fill: 'forwards'
      }).finished.then((animation) => {
        animation.cancel();
      });
    }
  }
}
