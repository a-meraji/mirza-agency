import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">Privacy Policy</h1>
      
      {/* English Version */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold mb-4">Privacy Policy (English)</h2>
        <p className="mb-4">Last Updated: {new Date().toLocaleDateString()}</p>
        
        <section className="mb-6">
          <h3 className="text-xl font-medium mb-2">Introduction</h3>
          <p className="mb-2">
            Welcome to our application. We respect your privacy and are committed to protecting your personal data.
            This Privacy Policy will inform you about how we look after your personal data when you use our application
            and tell you about your privacy rights and how the law protects you.
          </p>
        </section>
        
        <section className="mb-6">
          <h3 className="text-xl font-medium mb-2">Information We Collect</h3>
          <p className="mb-2">We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
          <ul className="list-disc pl-6 mb-2">
            <li>Identity Data: includes first name, last name, username or similar identifier.</li>
            <li>Contact Data: includes email address and telephone numbers.</li>
            <li>Technical Data: includes internet protocol (IP) address, your login data, browser type and version, device information.</li>
            <li>Usage Data: includes information about how you use our application.</li>
          </ul>
        </section>
        
        <section className="mb-6">
          <h3 className="text-xl font-medium mb-2">How We Use Your Information</h3>
          <p className="mb-2">We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
          <ul className="list-disc pl-6 mb-2">
            <li>To register you as a new user.</li>
            <li>To provide and improve our services to you.</li>
            <li>To manage our relationship with you.</li>
            <li>To administer and protect our business and this application.</li>
          </ul>
        </section>
        
        <section className="mb-6">
          <h3 className="text-xl font-medium mb-2">Data Security</h3>
          <p className="mb-2">
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, 
            or accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to your personal data to those 
            employees, agents, contractors, and other third parties who have a business need to know.
          </p>
        </section>
        
        <section className="mb-6">
          <h3 className="text-xl font-medium mb-2">Data Retention</h3>
          <p className="mb-2">
            We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, 
            including for the purposes of satisfying any legal, accounting, or reporting requirements.
          </p>
        </section>
        
        <section className="mb-6">
          <h3 className="text-xl font-medium mb-2">Your Legal Rights</h3>
          <p className="mb-2">Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:</p>
          <ul className="list-disc pl-6 mb-2">
            <li>Request access to your personal data.</li>
            <li>Request correction of your personal data.</li>
            <li>Request erasure of your personal data.</li>
            <li>Object to processing of your personal data.</li>
            <li>Request restriction of processing your personal data.</li>
            <li>Request transfer of your personal data.</li>
            <li>Right to withdraw consent.</li>
          </ul>
        </section>
        
        <section className="mb-6">
          <h3 className="text-xl font-medium mb-2">Third-Party Links</h3>
          <p className="mb-2">
            This application may include links to third-party websites, plug-ins, and applications. Clicking on those links 
            or enabling those connections may allow third parties to collect or share data about you. We do not control these 
            third-party websites and are not responsible for their privacy statements.
          </p>
        </section>
        
        <section className="mb-6">
          <h3 className="text-xl font-medium mb-2">Changes to the Privacy Policy</h3>
          <p className="mb-2">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
            You are advised to review this Privacy Policy periodically for any changes.
          </p>
        </section>
        
        <section className="mb-6">
          <h3 className="text-xl font-medium mb-2">Contact Us</h3>
          <p className="mb-2">
            If you have any questions about this Privacy Policy, please contact us at: merajiamin1997@gmail.com
          </p>
        </section>
      </div>
      
      {/* Persian Version */}
      {/* <div className="rtl text-right">
        <h2 className="text-2xl font-semibold mb-4">سیاست حفظ حریم خصوصی (فارسی)</h2>
        <p className="mb-4">آخرین به‌روزرسانی: {new Date().toLocaleDateString('fa-IR')}</p>
        
        <section className="mb-6">
          <h3 className="text-xl font-medium mb-2">مقدمه</h3>
          <p className="mb-2">
            به برنامه ما خوش آمدید. ما به حریم خصوصی شما احترام می‌گذاریم و متعهد به حفاظت از داده‌های شخصی شما هستیم.
            این سیاست حفظ حریم خصوصی به شما اطلاع می‌دهد که ما چگونه از داده‌های شخصی شما هنگام استفاده از برنامه ما مراقبت می‌کنیم
            و شما را از حقوق حریم خصوصی خود و نحوه حفاظت قانون از شما آگاه می‌سازد.
          </p>
        </section>
        
        <section className="mb-6">
          <h3 className="text-xl font-medium mb-2">اطلاعاتی که جمع‌آوری می‌کنیم</h3>
          <p className="mb-2">ما ممکن است انواع مختلفی از داده‌های شخصی را درباره شما جمع‌آوری، استفاده، ذخیره و منتقل کنیم که به شرح زیر گروه‌بندی شده‌اند:</p>
          <ul className="list-disc pr-6 mb-2">
            <li>داده‌های هویتی: شامل نام، نام خانوادگی، نام کاربری یا شناسه مشابه.</li>
            <li>داده‌های تماس: شامل آدرس ایمیل و شماره تلفن.</li>
            <li>داده‌های فنی: شامل آدرس پروتکل اینترنت (IP)، داده‌های ورود شما، نوع و نسخه مرورگر، اطلاعات دستگاه.</li>
            <li>داده‌های استفاده: شامل اطلاعات در مورد نحوه استفاده شما از برنامه ما.</li>
          </ul>
        </section>
        
        <section className="mb-6">
          <h3 className="text-xl font-medium mb-2">نحوه استفاده ما از اطلاعات شما</h3>
          <p className="mb-2">ما فقط زمانی از داده‌های شخصی شما استفاده می‌کنیم که قانون به ما اجازه دهد. معمولاً، ما از داده‌های شخصی شما در شرایط زیر استفاده می‌کنیم:</p>
          <ul className="list-disc pr-6 mb-2">
            <li>برای ثبت‌نام شما به عنوان کاربر جدید.</li>
            <li>برای ارائه و بهبود خدمات ما به شما.</li>
            <li>برای مدیریت رابطه ما با شما.</li>
            <li>برای اداره و محافظت از کسب و کار ما و این برنامه.</li>
          </ul>
        </section>
        
        <section className="mb-6">
          <h3 className="text-xl font-medium mb-2">امنیت داده‌ها</h3>
          <p className="mb-2">
            ما اقدامات امنیتی مناسبی را برای جلوگیری از گم شدن، استفاده یا دسترسی غیرمجاز، تغییر یا افشای داده‌های شخصی شما انجام داده‌ایم.
            علاوه بر این، ما دسترسی به داده‌های شخصی شما را به کارمندان، نمایندگان، پیمانکاران و سایر اشخاص ثالثی که نیاز تجاری به دانستن آن دارند، محدود می‌کنیم.
          </p>
        </section>
        
        <section className="mb-6">
          <h3 className="text-xl font-medium mb-2">حفظ داده‌ها</h3>
          <p className="mb-2">
            ما داده‌های شخصی شما را فقط تا زمانی که برای تحقق اهدافی که برای آن جمع‌آوری کرده‌ایم لازم باشد، نگه می‌داریم،
            از جمله برای اهداف رضایت‌بخش هرگونه الزامات قانونی، حسابداری یا گزارش‌دهی.
          </p>
        </section>
        
        <section className="mb-6">
          <h3 className="text-xl font-medium mb-2">حقوق قانونی شما</h3>
          <p className="mb-2">تحت شرایط خاصی، شما طبق قوانین حفاظت از داده‌ها در رابطه با داده‌های شخصی خود حقوقی دارید، از جمله حق:</p>
          <ul className="list-disc pr-6 mb-2">
            <li>درخواست دسترسی به داده‌های شخصی خود.</li>
            <li>درخواست اصلاح داده‌های شخصی خود.</li>
            <li>درخواست حذف داده‌های شخصی خود.</li>
            <li>اعتراض به پردازش داده‌های شخصی خود.</li>
            <li>درخواست محدودیت پردازش داده‌های شخصی خود.</li>
            <li>درخواست انتقال داده‌های شخصی خود.</li>
            <li>حق لغو رضایت.</li>
          </ul>
        </section>
        
        <section className="mb-6">
          <h3 className="text-xl font-medium mb-2">پیوندهای شخص ثالث</h3>
          <p className="mb-2">
            این برنامه ممکن است شامل پیوندهایی به وب‌سایت‌ها، پلاگین‌ها و برنامه‌های شخص ثالث باشد. کلیک بر روی آن پیوندها
            یا فعال‌سازی آن اتصالات ممکن است به اشخاص ثالث اجازه دهد داده‌هایی را درباره شما جمع‌آوری یا به اشتراک بگذارند.
            ما این وب‌سایت‌های شخص ثالث را کنترل نمی‌کنیم و مسئول بیانیه‌های حریم خصوصی آنها نیستیم.
          </p>
        </section>
        
        <section className="mb-6">
          <h3 className="text-xl font-medium mb-2">تغییرات در سیاست حفظ حریم خصوصی</h3>
          <p className="mb-2">
            ما ممکن است سیاست حفظ حریم خصوصی خود را هر از گاهی به‌روزرسانی کنیم. ما شما را از هرگونه تغییر با قرار دادن سیاست حفظ حریم خصوصی جدید در این صفحه مطلع می‌کنیم.
            توصیه می‌شود این سیاست حفظ حریم خصوصی را به طور دوره‌ای برای هرگونه تغییر بررسی کنید.
          </p>
        </section>
        
        <section className="mb-6">
          <h3 className="text-xl font-medium mb-2">تماس با ما</h3>
          <p className="mb-2">
            اگر سؤالی درباره این سیاست حفظ حریم خصوصی دارید، لطفاً با ما از طریق: merajiamin1997@gmail.com تماس بگیرید.
          </p>
        </section>
      </div> */}
    </div>
  );
};

export default PrivacyPolicy; 