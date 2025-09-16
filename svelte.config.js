import adapter from '@sveltejs/adapter-firebase';

export default {
  kit: {
    adapter: adapter({
      functionName: 'ssr'
    })
  }
};