
const key='cfpro';
let tx=JSON.parse(localStorage.getItem(key)||'[]');
const trend=new Chart(document.getElementById('trendChart'),{type:'line',data:{labels:[],datasets:[{label:'Net',data:[]}]}});
const pie=new Chart(document.getElementById('pieChart'),{type:'pie',data:{labels:[],datasets:[{data:[]}]}});

function rp(n){return 'Rp '+Number(n).toLocaleString('id-ID')}
function save(){localStorage.setItem(key,JSON.stringify(tx));}

document.getElementById('addBtn').onclick=()=>{
 const amount=Number(document.getElementById('amount').value||0);
 if(amount<=0) return;
 tx.push({
 id:Date.now(),
 date:document.getElementById('date').value,
 desc:document.getElementById('desc').value,
 type:document.getElementById('type').value,
 payment:document.getElementById('payment').value,
 amount
 });
 save(); render();
};

function del(id){tx=tx.filter(t=>t.id!==id);save();render();}

function render(){
 let income=0,expense=0,saving=0;
 let months={},pieData={};
 const q=(document.getElementById('search').value||'').toLowerCase();
 const body=document.getElementById('txBody'); body.innerHTML='';

 tx.filter(t=>JSON.stringify(t).toLowerCase().includes(q)).forEach(t=>{
   if(t.type==='income') income+=t.amount;
   if(t.type==='expense') expense+=t.amount;
   if(t.type==='saving') saving+=t.amount;

   pieData[t.type]=(pieData[t.type]||0)+t.amount;
   const m=(t.date||'').slice(0,7)||'N/A';
   months[m]=(months[m]||0)+(t.type==='income'?t.amount:-t.amount);

   body.innerHTML+=`<tr><td>${t.date}</td><td>${t.desc}</td><td>${t.type}</td><td>${t.payment}</td><td>${rp(t.amount)}</td><td><button onclick="del(${t.id})">Hapus</button></td></tr>`;
 });

 document.getElementById('incomeTotal').textContent=rp(income);
 document.getElementById('expenseTotal').textContent=rp(expense);
 document.getElementById('savingTotal').textContent=rp(saving);
 document.getElementById('balanceTotal').textContent=rp(income-expense-saving);

 trend.data.labels=Object.keys(months);
 trend.data.datasets[0].data=Object.values(months);
 trend.update();

 pie.data.labels=Object.keys(pieData);
 pie.data.datasets[0].data=Object.values(pieData);
 pie.update();
}
document.getElementById('search').addEventListener('input',render);
document.getElementById('date').value=new Date().toISOString().split('T')[0];
render();
