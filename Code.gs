const SHEET_NAME = 'Registrations';
const HEADERS = ['ID','CreatedAt','Name','Phone','Group','Guests','GuestType','Table','Note','Status','CheckInAt','Token'];

function doGet(e) {
  const page = (e && e.parameter && e.parameter.page) || 'register';
  const allowed = ['register','staff','admin'];
  const file = allowed.includes(page) ? page : 'register';
  return HtmlService.createTemplateFromFile(file).evaluate()
    .setTitle('MESOOK Event Registration')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport','width=device-width, initial-scale=1');
}

function include(filename) { return HtmlService.createHtmlOutputFromFile(filename).getContent(); }

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) sh.appendRow(HEADERS);
  sh.setFrozenRows(1);
  return 'พร้อมใช้งาน';
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) { setup(); sh = ss.getSheetByName(SHEET_NAME); }
  return sh;
}

function registerGuest(data) {
  if (!data || !String(data.name||'').trim()) throw new Error('กรุณากรอกชื่อ-นามสกุล');
  if (!String(data.phone||'').trim()) throw new Error('กรุณากรอกเบอร์โทรศัพท์');
  const sh = getSheet_();
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const n = Math.max(1, sh.getLastRow());
    const id = 'MS-' + String(n).padStart(6,'0');
    const token = Utilities.getUuid();
    sh.appendRow([id,new Date(),clean_(data.name),clean_(data.phone),clean_(data.group),Number(data.guests||0),clean_(data.guestType),clean_(data.table),clean_(data.note),'REGISTERED','',token]);
    return {ok:true,id:id,token:token,name:clean_(data.name)};
  } finally { lock.releaseLock(); }
}

function checkIn(value) {
  const sh = getSheet_();
  const vals = sh.getDataRange().getValues();
  const key = String(value||'').trim();
  for (let r=1;r<vals.length;r++) {
    if (String(vals[r][0])===key || String(vals[r][11])===key) {
      if (String(vals[r][9])==='CHECKED_IN') return {ok:false,duplicate:true,id:vals[r][0],name:vals[r][2],time:vals[r][10]};
      const now = new Date();
      sh.getRange(r+1,10).setValue('CHECKED_IN');
      sh.getRange(r+1,11).setValue(now);
      return {ok:true,id:vals[r][0],name:vals[r][2],guests:vals[r][5],table:vals[r][7],time:now};
    }
  }
  return {ok:false,notFound:true};
}

function getDashboard() {
  const sh=getSheet_(); const vals=sh.getDataRange().getValues();
  const rows=vals.slice(1).map(r=>({id:r[0],created:r[1],name:r[2],phone:r[3],group:r[4],guests:r[5],guestType:r[6],table:r[7],note:r[8],status:r[9],checkInAt:r[10]}));
  return {total:rows.length,checked:rows.filter(x=>x.status==='CHECKED_IN').length,pending:rows.filter(x=>x.status!=='CHECKED_IN').length,followers:rows.reduce((s,x)=>s+Number(x.guests||0),0),rows:rows.reverse()};
}
function clean_(v){return String(v||'').trim().replace(/[<>]/g,'');}
