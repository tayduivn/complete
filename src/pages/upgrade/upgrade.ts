import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  AlertController,
  MenuController
} from "ionic-angular";
import { CategoriesPage } from "../categories/categories";
import { LeadsPage } from "../leads/leads";
import { ChatPage } from "../chat/chat";
import { RfqPage } from "../rfq/rfq";

import { WebinarPage } from "../webinar/webinar";
import { HttpClient } from "@angular/common/http";
import { Storage } from "@ionic/storage";
import { MyApp } from "../../app/app.component";
import { MyaccountPage } from "../myaccount/myaccount";


@Component({
  selector: "page-upgrade",
  templateUrl: "upgrade.html"
})
export class UpgradePage {
  showchapters = false;
  userdetails: any;
  user_id: any;
  country_id: any;
  subscription: any;
  upgradeplans: any;
  pack_id: any;
  credits: any;
  chapters: any;
  packdetails: any;
  isenabled: boolean;
  subscription_id: any;
  selectedItems: any;
  dropdownSettings = {};
  ChapList: any;
  count: any;
  walletcredits: any;
  responseObj: any;

  selectedhscodes = {};
  dropdownSettings1 = {};
  hsdetails: any;
  chap_id: any;
  packhscode: any;
  mysubscription_id: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private http: HttpClient,
    private storage: Storage,
    public menuCtrl: MenuController
  ) {}

  toggleMenu() {
    this.menuCtrl.toggle();
  }
  home() {
    this.navCtrl.push(CategoriesPage);
  }
  leads() {
    this.navCtrl.push(LeadsPage);
  }
  chatting() {
    this.navCtrl.push(ChatPage);
  }
  webinar() {
    this.navCtrl.push(WebinarPage);
  }
  quotes() {
    this.navCtrl.push(RfqPage);
  }
  free(i) {
    this.subscription_id = this.upgradeplans[i].id;
    if (
      this.mysubscription_id >= this.subscription_id
    
    ) {
      const alert = this.alertCtrl.create({
        title: "Oops!",
        subTitle: "You cannot upgrade to the same package OR to Lower One",
        buttons: ["OK"],
        cssClass: "buttoncss"
      });
      alert.present();
      this.navCtrl.push(MyaccountPage);
    }
    else{
    this.showchapters = true;
    this.pack_id = this.upgradeplans[i].chapters;
    this.packhscode = this.upgradeplans[i].hscodes;
    this.subscription_id = this.upgradeplans[i].id;
    console.log("show chapters pack id", this.pack_id);
    console.log("show chapters pack id", this.subscription_id);
    this.http.get(MyApp.url + "chapters.php").subscribe(data => {
      this.chapters = data;
      this.ChapList = this.chapters;
      console.log(this.chapters, "chapters");
    });
    console.log(this.chapters, "chapter names");

    this.selectedItems = {};
    console.log(this.selectedItems, "selected list");
    this.dropdownSettings = {
      singleSelection: false,
      idField: "id",
      textField: "chapter_name",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: "3",
      limitSelection: this.pack_id,
      allowSearchFilter: true,
      closeDropDownOnSelection: true
    };
  }
  }
  upgrade(i) {
    if (
      this.mysubscription_id == this.subscription_id &&
      this.selectedItems != "" &&
      this.selectedhscodes != ""
    ) {
      const alert = this.alertCtrl.create({
        title: "Oops!",
        subTitle: "You cannot upgrade to the same package!",
        buttons: ["OK"],
        cssClass: "buttoncss"
      });
      alert.present();
      this.navCtrl.push(MyaccountPage);
    } else {
      var link = MyApp.url + "upgrade.php";
      var Jdata = JSON.stringify({
        user_id: this.user_id,
        chapter_id: this.selectedItems,
        hscodes: this.selectedhscodes,
        pack_id: this.subscription_id,
        credits: this.credits
      });
      console.log(Jdata);
      this.http.post(link, Jdata).subscribe(cdata => {
        this.packdetails = cdata;
        console.log(cdata, "free package details");
        if (cdata) {
          this.navCtrl.push(CategoriesPage, {
            userid: this.user_id
          });
        } else {
          const alert = this.alertCtrl.create({
            title: "Oops!",
            subTitle: "Some thing went wrong!",
            buttons: ["OK"],
            cssClass: "buttoncss"
          });
          alert.present();
        }
      });
    }
  }

  onItemSelect(item: any) {
    console.log(item, "selecteditem");
    console.log(item.id, "id no");
    this.chap_id = item.id;
    console.log(this.selectedItems);
    var link = MyApp.url + "getpackhsncodes.php";
    var Jsondata = JSON.stringify({
      chapter_id: this.selectedItems,
      country_id:this.country_id
    });
    console.log("jsndata", Jsondata);
    this.http.post(link, Jsondata).subscribe(data => {
      this.hsdetails = data;
      console.log("hscode", this.hsdetails);
      this.selectedhscodes = {};
      console.log(this.selectedhscodes, "selected list");
      this.dropdownSettings1 = {
        singleSelection: false,
        idField: "hscode",
        textField: "MyColumn",
        selectAllText: "Select All",
        unSelectAllText: "UnSelect All",
        allowSearchFilter: true,
        
      };
    });
  }
  onhscodeselect(hscode) {
    console.log("hscode", hscode);
  }
  onallhscodes(hscodes) {
    console.log("hscodes all", hscodes);
  }
  //packages multiselect list
  ngOnInit() {
    /*  this.http.get(MyApp.url+"chapters.php").subscribe((data) => {
      this.chapters = data;
      this.ChapList = this.chapters;
      console.log(this.chapters, 'chapters');
    });
    console.log(this.chapters, 'chapter names');

    this.selectedItems = {};
    console.log(this.selectedItems, 'selected list');
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'chapter_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
       itemsShowLimit: '3',
      limitSelection: this.pack_id,
      allowSearchFilter: true,
      closeDropDownOnSelection:true,
      
    };*/
  }

  onSelectAll(items: any) {
    console.log(this.selectedItems, "selected _items total");
  }

  ionViewDidLoad() {
    this.storage.get("userdetails").then(val => {
      this.userdetails = val;
      this.user_id = this.userdetails[0].id;
      this.country_id = this.userdetails[0].country_id;
      this.http
        .get(MyApp.url + "getsubscriptions.php?country_id=" + this.country_id)
        .subscribe(pdata => {
          this.upgradeplans = pdata;
          console.log("subscription packs", this.upgradeplans);
        });
      this.http
        .get(MyApp.url + "mypackage.php?user_id=" + this.user_id)
        .subscribe(pakdata => {
          this.subscription = pakdata;
          this.mysubscription_id = this.subscription[0].id;
          console.log("my packid", this.mysubscription_id);
        });
      this.http
        .get(MyApp.url + "getcredits.php?user_id=" + this.user_id)
        .subscribe(edata => {
          this.walletcredits = edata;
          this.credits = this.walletcredits[0].credits;
          //console.log(this.walletcredits, 'mycredits',this.credits);
          console.log(this.walletcredits);
        });
    });
    console.log("ionViewDidLoad UpgradePage");
  }
}
