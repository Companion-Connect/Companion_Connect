export function celebrateBadge(badgeName, badgeIcon = '🏅') {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.left = '0';
  overlay.style.top = '0';
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.background = 'rgba(0,0,0,0.45)';
  overlay.style.display = 'flex';
  overlay.style.flexDirection = 'column';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.zIndex = '9999';
  overlay.style.animation = 'fadeInCelebration 0.2s';
  const popup = document.createElement('div');
  popup.style.background = 'white';
  popup.style.borderRadius = '24px';
  popup.style.boxShadow = '0 4px 32px rgba(0,0,0,0.18)';
  popup.style.padding = '48px 36px 32px 36px';
  popup.style.display = 'flex';
  popup.style.flexDirection = 'column';
  popup.style.alignItems = 'center';
  popup.style.minWidth = '320px';

  const icon = document.createElement('div');
  icon.innerText = badgeIcon;
  icon.style.fontSize = '5rem';
  icon.style.marginBottom = '16px';

  const congrats = document.createElement('div');
  congrats.innerText = 'Congratulations!';
  congrats.style.fontWeight = 'bold';
  congrats.style.fontSize = '2rem';
  congrats.style.marginBottom = '10px';
  congrats.style.color = 'orange';

  const earned = document.createElement('div');
  earned.innerText = `You earned the "${badgeName}" badge!`;
  earned.style.fontSize = '1.2rem';
  earned.style.textAlign = 'center';
  earned.style.marginBottom = '18px';
  earned.style.color = 'orange';

  const btn = document.createElement('button');
  btn.innerText = 'Close';
  btn.style.marginTop = '10px';
  btn.style.padding = '8px 24px';
  btn.style.fontSize = '1rem';
  btn.style.background = '#10b981';
  btn.style.color = 'white';
  btn.style.border = 'none';
  btn.style.borderRadius = '8px';
  btn.style.cursor = 'pointer';
  btn.onclick = () => overlay.remove();

  popup.appendChild(icon);
  popup.appendChild(congrats);
  popup.appendChild(earned);
  popup.appendChild(btn);
  overlay.appendChild(popup);
  document.body.appendChild(overlay);

  if (!document.getElementById('celebration-fadein-style')) {
    const style = document.createElement('style');
    style.id = 'celebration-fadein-style';
    style.innerHTML = `@keyframes fadeInCelebration { from { opacity: 0; } to { opacity: 1; } }`;
    document.head.appendChild(style);
  }
}
