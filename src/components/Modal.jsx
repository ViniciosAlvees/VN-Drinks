import { useEffect, useRef } from 'react';

// O dialog nativo prende o foco, fecha com Escape e permite empilhar o seletor sobre o carrinho.
export default function Modal({ className, labelledBy, describedBy, onClose, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    const previousFocus = document.activeElement;
    dialog.showModal();
    document.body.classList.add('dialog-open');
    return () => {
      dialog.close();
      if (!document.querySelector('dialog[open]')) document.body.classList.remove('dialog-open');
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, []);
  return <dialog ref={ref} className={className} aria-labelledby={labelledBy} aria-describedby={describedBy} onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => {
    if (event.target !== event.currentTarget) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
  }}>{children}</dialog>;
}
