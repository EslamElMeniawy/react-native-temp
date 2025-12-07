import type common from '@modules/localization/src/translations/en/common';

const ar: typeof common = {
  appName: 'TempApp',
  errorFallbackTitle: 'عفوًا، هناك خطأ ما',
  errorFallbackMessage:
    'واجه التطبيق مشكلة ولم يتمكن من المتابعة. ونحن نعتذر عن أي إزعاج قد تسبب به هذا! اضغط على الزر أدناه لإعادة تشغيل التطبيق.',
  restartApp: 'أعد تشغيل التطبيق',
  sessionExpired:
    'انتهت صلاحية جلسة تسجيل الدخول الخاصة بك.\nالرجاء تسجيل الدخول من جديد.',
  unknownError: 'حدث خطأ غير معروف',
  networkError: 'حدث خطأ في الشبكة',
  ok: 'حسناً',
  internetLost: 'انقطع الاتصال بالإنترنت!',
  errorProcessingRequest: 'خطأ أثناء تنفيذ طلبك',
  errorOpenUrl: 'خطأ أثناء فتح الرابط\nتأكد من تثبيت تطبيق متصفح لديك',
  errorOpenMail: 'خطأ أثناء فتح البريد\nتأكد من تثبيت تطبيق بريد لديك',
  errorOpenPhone: 'خطأ أثناء فتح الهاتف\nتأكد من تثبيت تطبيق الهاتف لديك',
  errorOpenWhatsApp: 'خطأ أثناء فتح واتساب\nتأكد من تثبيت تطبيق واتساب',
  fieldRequired: 'حقل {{field}} مطلوب',
  errorWhileAction: 'خطأ اثناء {{action}}',
  noDataAvailable: 'لا توجد {{data}} متاحة',
  errorLoadData: 'خطأ اثناء تحميل {{data}}',
};

export default ar;
