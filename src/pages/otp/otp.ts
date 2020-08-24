import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, ToastController, Platform, LoadingController, AlertController } from 'ionic-angular';
import { SubscriptionPage } from '../subscription/subscription';
import { HttpClient } from '@angular/common/http';
import { MyApp } from '../../app/app.component';
import { Storage } from '@ionic/storage';
import { EmailverificationPage } from '../emailverification/emailverification';


@Component({
  selector: 'page-otp',
  templateUrl: 'otp.html',
})
export class OtpPage {
  mobile:any;
  user_id:any;
  country_id:any;
  otp:string="";
  otpdata:any;
  resenddata:any;
  state_id:any;
  userdetails: Promise<any>;
  userdata: any;
  maxtime: number;
  skiptimer: any;
  country_code: any;
  usermobile: any;
  usertype: any;
  packdetails: Object;
  constructor(public navCtrl: NavController, public platform: Platform, public navParams: NavParams,public menuCtrl : MenuController,
    private http:HttpClient ,public toastCtrl: ToastController, public storage:Storage, public loadingCtrl:LoadingController, public alertCtrl:AlertController) {
      platform.registerBackButtonAction(() => {
      },1);
      this.menuCtrl.enable(false, "sideMenu");
    /* const loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 5000
    });
    loader.present(); */
    this.country_code = this.navParams.get("Country_code");
    this.usermobile = this.navParams.get("Mobile");
    this.userdetails =this.storage.get('userdetails').then((val)=>{
      this.userdata = val;
      this.mobile = this.userdata[0].mobile;
      this.usertype = this.userdata[0].user_type;
      this.user_id = this.userdata[0].id;
      console.log(this.mobile, "My Mobile number");
    });
   
   
  }
  toggleMenu() {
    this.menuCtrl.toggle();
  }
  resend(){
    var link=MyApp.url+"resendotp.php";
    var rdata=JSON.stringify({
    'mobile':this.usermobile,
    'country_code':this.country_code
    });
    this.http.post(link,rdata).subscribe((data)=>{
      this.resenddata =data;
      console.log('resend otp datac status',data);
      if(data==1){
        const toast = this.toastCtrl.create({
          message: 'OTP Sent Successfully',
          duration: 4000
        });
        toast.present();
      }
      else{
        const toast = this.toastCtrl.create({
          message: 'Something Went wrong',
          duration: 4000
        });
        toast.present();
      }
    
    });
    
  }
  onOtpChange(event:string){
    this.otp = event;
    console.log(this.otp);
  }
  confirm(){
    console.log('otp=',this.otp);
    clearInterval(this.skiptimer);
    var link=MyApp.url+"otpvalidate.php";
    var Jdata=JSON.stringify({
    'otp':this.otp,
    'mobile':this.mobile,
    });
    console.log('otp no',Jdata);
    this.http.post(link,Jdata).subscribe((data)=>{
      this.otpdata = data;
      console.log('otp value result',data);
      if(data==1){
        if(this.usertype == "Other"){
          this.navCtrl.push(EmailverificationPage);

        }else{
          const loader = this.loadingCtrl.create({
            content: "Please wait creating welcome kit for you",
          });
          loader.present();
              var link = MyApp.url+"usersubscription.php";
              var Jdata = JSON.stringify({
                'user_id': this.user_id,
                'pack_id': 40,
                'duration': 365,
                'country_id': this.country_id,
                'state_id': this.state_id,
                'credits': 3,
                'plan_name':'Demo',
              });
              console.log(Jdata);
              this.http.post(link, Jdata).subscribe((cdata) => {
                this.packdetails = cdata;
                console.log(cdata, 'free package details');
                if (cdata) {
                  loader.dismiss();
                  this.navCtrl.push(EmailverificationPage)
                }
                else {
                  loader.dismiss();
                  const alert = this.alertCtrl.create({
                    title: 'Oops!',
                    subTitle: 'Something  went wrong!',
                    buttons: ['OK'],
                    cssClass: 'buttoncss'
                  });
                  alert.present();
                }
          
              });

        }
         
      }
      else{
        const toast = this.toastCtrl.create({
          message: 'Incorrect OTP',
          duration: 4000
        });
        toast.present();
      }
    })
    /**/
  }
  ionViewDidLoad() {
    //this.storage.get('signupdata',this.signupdata);
    console.log('ionViewDidLoad OtpPage');
    this.maxtime=180
    this.skiptimer = setInterval(x => 
      {
          if(this.maxtime <= 1) {
            //this.twobtn = true;
            clearInterval(this.skiptimer);
            this.resend();
          }
          this.maxtime -= 1;
          
      }, 1000);
  }

}
