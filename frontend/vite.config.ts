import { defineConfig } from 'vite';
export default defineConfig(({command})=>({
 base:'./',
 publicDir:command==='build'?false:'public',
 build:{minify:false},
 server:{port:5175}
}));
