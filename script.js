/* ===== CONFIG ===== */
const WHATSAPP_NUMBER = '5538991292731'; // número do vendedor (sem +)
const COURSE_NAME = 'Curso Marketing Digital - Promo R$69,90';
const PRICE = 'R$ 69,90';
const START_DATE = new Date('2025-08-25T00:00:00-03:00'); // início do curso (BRT)

/* ===== HELPERS ===== */
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

/* ===== COUNTDOWN ===== */
function updateCountdown(){
  const el = $('#countdown');
  if(!el) return;
  const now = new Date();
  let diff = START_DATE - now;
  if(diff <= 0){ el.textContent = 'Início em breve'; return; }
  const days = Math.floor(diff / (1000*60*60*24));
  diff -= days*(1000*60*60*24);
  const hours = Math.floor(diff / (1000*60*60));
  diff -= hours*(1000*60*60);
  const minutes = Math.floor(diff / (1000*60));
  const seconds = Math.floor((diff - minutes*(1000*60))/1000);
  el.textContent = `${days}d ${String(hours).padStart(2,'0')}h ${String(minutes).padStart(2,'0')}m ${String(seconds).padStart(2,'0')}s`;
}
updateCountdown();
setInterval(updateCountdown,1000);

/* ===== BUYBAR VISIBILITY ===== */
function checkBuybar(){
  const buybar = $('#buybar');
  if(!buybar) return;
  if(window.innerWidth <= 980){ buybar.style.display='flex'; buybar.setAttribute('aria-hidden','false'); }
  else { buybar.style.display='none'; buybar.setAttribute('aria-hidden','true'); }
}
checkBuybar();
window.addEventListener('resize', checkBuybar);

/* ===== MASKS ===== */
function maskCPF(v){ return v.replace(/\D/g,'').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d{1,2})$/,'$1-$2').substring(0,14); }
function maskDate(v){ return v.replace(/\D/g,'').replace(/(\d{2})(\d)/,'$1/$2').replace(/(\d{2})(\d)/,'$1/$2').substring(0,10); }
function maskPhone(v){ return v.replace(/\D/g,'').replace(/(\d{2})(\d)/,'($1) $2').replace(/(\d{5})(\d)/,'$1-$2').substring(0,16); }

const cpfEl = $('#cpf'); if(cpfEl) cpfEl.addEventListener('input', e => e.target.value = maskCPF(e.target.value));
const nascEl = $('#nascimento'); if(nascEl) nascEl.addEventListener('input', e => e.target.value = maskDate(e.target.value));
const telEl = $('#telefone'); if(telEl) telEl.addEventListener('input', e => e.target.value = maskPhone(e.target.value));

/* ===== CPF VALIDATION ===== */
function isValidCPF(strCPF){
  const cpf = (strCPF || '').replace(/\D/g,'');
  if(cpf.length !== 11) return false;
  if (/^(\d)\1+$/.test(cpf)) return false;
  let sum=0, rem;
  for(let i=1;i<=9;i++) sum += parseInt(cpf.substring(i-1,i)) * (11-i);
  rem = (sum*10) % 11;
  if(rem === 10 || rem === 11) rem = 0;
  if(rem !== parseInt(cpf.substring(9,10))) return false;
  sum=0;
  for(let i=1;i<=10;i++) sum += parseInt(cpf.substring(i-1,i)) * (12-i);
  rem = (sum*10) % 11;
  if(rem === 10 || rem === 11) rem = 0;
  if(rem !== parseInt(cpf.substring(10,11))) return false;
  return true;
}

/* ===== FORM SUBMIT: Netlify + WhatsApp ===== */
const form = $('#checkoutForm');
if(form){
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = $('#nome').value.trim();
    const nascimento = $('#nascimento').value.trim();
    const cpf = $('#cpf').value.trim();
    const email = $('#email').value.trim();
    const telefone = $('#telefone').value.trim();
    const pagamento = $('#pagamento').value;

    if(!nome || !nascimento || !cpf){
      alert('Preencha Nome, Data de nascimento e CPF.');
      return;
    }
    if(!isValidCPF(cpf)){
      alert('CPF inválido. Verifique os dígitos e tente novamente.');
      return;
    }

    // montar mensagem
    const lines = [
      `Olá! Quero adquirir o ${COURSE_NAME}.`,
      '',
      'Meus dados:',
      `Nome: ${nome}`,
      `Nascimento: ${nascimento}`,
      `CPF: ${cpf}`,
      email ? `Email: ${email}` : '',
      telefone ? `Telefone: ${telefone}` : '',
      `Forma de pagamento: ${pagamento}`,
      '',
      `Valor: ${PRICE}`,
      '',
      'Por favor, envie a chave PIX e instruções para concluir o pagamento.'
    ].filter(Boolean).join('\n');

    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines)}`;

    // tentar gravar no Netlify (lead)
    try{
      const data = new FormData(form);
      await fetch('/', { method:'POST', body: data });
    }catch(err){
      console.warn('Netlify submit failed:', err);
    }finally{
      // abrir whatsapp numa nova aba
      window.open(waUrl, '_blank');

      // abrir modal com instruções
      openPixModal();
      form.reset();
    }
  });
}

/* ===== MODAL PIX ===== */
const pixModal = $('#pixModal');
const pixClose = $('#pixClose');
const modalProceed = $('#modalProceed');
const modalCancel = $('#modalCancel');

function openPixModal(){ if(!pixModal) return; pixModal.setAttribute('aria-hidden','false'); }
function closePixModal(){ if(!pixModal) return; pixModal.setAttribute('aria-hidden','true'); }

if(pixClose) pixClose.addEventListener('click', closePixModal);
if(modalCancel) modalCancel.addEventListener('click', closePixModal);
if(modalProceed) modalProceed.addEventListener('click', () => { closePixModal(); /* user continues on WhatsApp */ });

/* ===== Buttons & interactions ===== */
const btnBuy = $('#btnBuy'); if(btnBuy) btnBuy.addEventListener('click', ()=> $('#form').scrollIntoView({behavior:'smooth',block:'center'}));
const topBuy = $('#topBuy'); if(topBuy) topBuy.addEventListener('click', (e)=>{ e.preventDefault(); $('#form').scrollIntoView({behavior:'smooth',block:'center'}); });
const bbBuy = $('#bbBuy'); if(bbBuy) bbBuy.addEventListener('click', ()=> btnBuy && btnBuy.click());
const btnPixInfo = $('#btnPixInfo'); if(btnPixInfo) btnPixInfo.addEventListener('click', openPixModal);
const btnPixInfo2 = $('#btnPixInfo2'); if(btnPixInfo2) btnPixInfo2.addEventListener('click', openPixModal);
const btnReset = $('#btnReset'); if(btnReset) btnReset.addEventListener('click', ()=> { if(confirm('Limpar o formulário?')) form.reset(); });

/* ===== Accessibility: close modal with ESC ===== */
document.addEventListener('keydown', (ev) => { if(ev.key === 'Escape') closePixModal(); });

/* ===== Prevent quick double submits ===== */
let submitting = false;
if(form){
  form.addEventListener('submit', ()=> {
    if(submitting) return;
    submitting = true;
    setTimeout(()=> submitting = false, 5000);
  });
}

