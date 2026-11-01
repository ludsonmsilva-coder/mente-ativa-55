/* Meta Pixel — Mente Ativa 55+
   Fica em arquivo separado para a página poder bloquear scripts embutidos (CSP). */
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');

fbq('init', '630700595718957');
fbq('track', 'PageView');
fbq('track', 'ViewContent', { content_name: 'Mente Ativa 55+', value: 27, currency: 'BRL' });
