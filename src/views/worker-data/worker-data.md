## worker data module

หัวข้อเเสดงเเละจัดการข้อมูลพนักงานในตำเเหน่งต่างๆ
  1. Guide
  2. พนักงานขาย
  3. คนขับรถ
  

  เพิ่ม menu หลัก worker data ในส่วนของ setting ครับเพราะจะมีเเค่ admin ที่สามารถทำรายการได้ เเละเเสดงเป็นหัวข้อย่อยดังนี้

    1. รายการ Guide
        - หน้าหลัดเเสดง list รายชื่อ guide สามารถต้นหา guide ได้
        - สามารถสร้าง guide คนใหม่ได้
    2. รายการพนักงานขาย
        - หน้าหลัดเเสดง list รายชื่อ พนักงานขาย สามารถต้นหา พนักงานขาย ได้
        - สามารถสร้าง พนักงานขาย คนใหม่ได้
    3. รายการคนขับรถ
        - หน้าหลัดเเสดง list รายชื่อ คนขับรถ สามารถต้นหา คนขับรถ ได้
        - สามารถสร้าง คนขับรถ คนใหม่ได้

        ** ให้คุณสามารถเพิ่ม data ที่เกี่ยวข้องให้ก่อนได้ลองคิดมาดูครับ


    ข้อมูลสำคัญเบื้องต้น
      - ตั้งรหัส required
      - ชื่อ TH required
      - ชื่อ EN required
      - เพศ required
      - เบอร์โทร required
      - E-mail
      - ที่อยู่


      *** รายการเเสดงให้ใช้ data-table ที่ E:\coqo_gem_production\code\gem-ui\src\components\prime-vue\data-table.vue

      *** alert ใช้ E:\coqo_gem_production\code\gem-ui\src\components\alert

      *** ให้เขียน style กลางไว้ที่ E:\coqo_gem_production\code\gem-ui\src\assets\styles\components เเล้ว import เข้ามาเเทนครับเราจะไม่ประกาศ global stly

      ***รองรับ 2 ภาษา EN, TH


   