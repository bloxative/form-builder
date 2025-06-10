export default defineAppConfig({
  ui: {
    textarea: {
      slots: {
        base: ['h-full']
      }
    },
    select: {
      slots: {
        base: ['!h-auto']
      }
    }
  }
});
