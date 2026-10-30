# MESOOK Event Registration — Google Sheets + Apps Script

ระบบลงทะเบียนสำหรับแชร์ลิงก์ในกลุ่ม LINE: ลงทะเบียน → ได้ QR → STAFF เช็กอิน → Dashboard ผู้จัดงาน

## ติดตั้ง
1. สร้าง Google Sheet ใหม่
2. เปิด Extensions > Apps Script
3. สร้างไฟล์ตามชุดนี้: `Code.gs`, `register.html`, `staff.html`, `admin.html`, `styles.html` แล้วคัดลอกเนื้อหาเข้าไป
4. ใน Apps Script เลือกฟังก์ชัน `setup` แล้วกด Run หนึ่งครั้ง และอนุญาตสิทธิ์
5. Deploy > New deployment > Web app
6. Execute as: Me / Who has access: Anyone (หรือค่าที่เหมาะกับบัญชีองค์กร)
7. คัดลอก Web App URL

## ลิงก์ใช้งาน
- ลงทะเบียน: `WEB_APP_URL?page=register`
- STAFF: `WEB_APP_URL?page=staff`
- Dashboard: `WEB_APP_URL?page=admin`

นำลิงก์ `?page=register` ไปส่งหรือปักหมุดในกลุ่ม LINE ได้ทันที

## หมายเหตุสำคัญก่อนใช้จริง
- หน้า Admin/Staff ในชุดต้นแบบยังไม่มีระบบล็อกอินแยก ควรเพิ่มการยืนยันตัวตนก่อนใช้กับงานสาธารณะ
- QR ใช้ไลบรารี qrcodejs จาก CDN ดังนั้นอุปกรณ์ต้องเชื่อมต่ออินเทอร์เน็ตตอนสร้าง QR
- ควรทดสอบการลงทะเบียนและเช็กอินด้วยบัญชี/มือถือจริงก่อนวันงาน
- ข้อมูลชื่อและเบอร์โทรเป็นข้อมูลส่วนบุคคล ควรแจ้งวัตถุประสงค์การเก็บข้อมูลและจำกัดผู้เข้าถึง Sheet
