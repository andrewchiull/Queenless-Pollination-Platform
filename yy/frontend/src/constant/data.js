import person1 from '../picture/person0.png';
import person2 from '../picture/person1.png';
import person3 from '../picture/person2.png';
import person4 from '../picture/person3.png';
import person5 from '../picture/person4.png';

const QAList = [
    {
        index :0,
        value : "常遇到的疑問",
    },
    {
        index :1,
        value : "使用上的疑問" 
    },
    {
        index:2,
        value :"使用後觀察到的疑問",
    },
    {
        index :3,
        value: "作物建議使用量",
    },
]
const FAQ = [
    {
        Type:0,
        Index:0,
        Q:'與傳統蜂箱最大差異在哪?',
        A:'我們的授粉蜂箱與傳統蜂箱最大的差異在於蜂箱內無蜂王，有台大研發的專利技術可於巢內穩定蜂群進行授粉工作。',
    },
    {
        Type:0,
        Index:1,
        Q:'一箱可以使用多久?',
        A:'一箱約使用2個月，若寒流低溫則會縮短一些時間，天氣炎熱會增加一些時間。'
    },
    {
        Type:0,
        Index:2,
        Q:'一箱多少錢?',
        A:'原價2980元，目前為推廣價格1箱為2480元。'
    },
    {
        Type:0,
        Index:3,
        Q:'一箱有多少蜜蜂?',
        A:'約2～3千隻蜜蜂，裡面的蜂都不需要照顧蜂王和幼蟲，全部都會是擔任授粉工作的蜜蜂。其實溫網室空間是受限的，真正需要的授粉蜂數量不需要太多，傳統的蜂箱一整箱移入，數量都過多，所以才會需要開箱餵食。'
    },
    {
        Type:0,
        Index:4,
        Q:'我現在訂多就會送到?',
        A:'如果我們沒有設定配送日期的話，您下訂後我們會花一天時間準備蜜蜂，宅配也需一天時間配送，所以會是隔2天到貨。'
    },
    {
        Type:0,
        Index:5,
        Q:'長期或大量訂購有打折嗎？',
        A:'有的，可直接與負責人聯繫確認喔。'
    },
    {
        Type:0,
        Index:6,
        Q:'目前有什麼優惠活動嗎？',
        A:'我們也希望能讓更多農戶使用這個好產品，因此希望使用過的農戶能幫忙推廣分享，所以只要有農戶因為您的推薦而使用我們的授粉蜂，每一位農戶我們就會再您下次購買授粉蜂時折抵500元，您介紹越多就會折抵越多。'
    },
    {
        Type:1,
        Index:7,
        Q:'為何不用餵食？',
        A:'傳統蜂箱內最需要食物的是幼蟲再來是蜂王，真的變成成蟲的工蜂所需食物量很少。而我們的授粉蜂箱內沒有蜂王與幼蟲，並且出貨前就含有一些食物，因此只要溫網室內有作物可供蜜蜂採食，基本上就可以滿足蜜蜂的食物所需，因此可以不用開箱餵食。'
    },
    {
        Type:1,
        Index:8,
        Q:'移入蜂箱前需要準備什麼？',
        A:'需準備水源讓蜜蜂採水降溫，可準備一桶水上方放上葉子讓蜜蜂可以站在上面採水；準備一個籃子倒置於地面，可將授粉蜂箱架高。'
    },
    {
        Type:1,
        Index:9,
        Q:'授粉完可以移到別的溫網室繼續使用嗎？',
        A:'可以的，但如果已經使用超過一個月，再移入其他溫室後，須注意蜜蜂數量是否會因為移蜂死亡而無法滿足授粉需求。且移蜂須注意蜂口朝向須保持同一個方向，可減少蜜蜂撞網死亡的數量。'
    },
    {
        Type:1,
        Index:10,
        Q:'什麼時候需要補蜂？',
        A:'每種作物授粉蜂的需求量不同，我們的蜂箱蜜蜂可授粉2個月，但後期蜜蜂因為壽命到了會慢慢死亡而數量變少，需觀察數量變少的蜂群，是否還可滿足授粉需求，如無法滿足就需要再補蜂進入溫網室。'
    },
    {
        Type:1,
        Index:11,
        Q:'如果我要噴農藥怎麼辦？',
        A:'如對蜜蜂是低毒性的農藥，可以在晚上蜜蜂回家後關上蜂口，再進行噴藥的操作。但需要確保隔天葉片上的液體乾掉，不能讓蜜蜂採水時採到農藥殘留的液體。如不確定農藥的毒性，可直接與負責人聯繫確認操作方式。'
    },
    {
        Type:1,
        Index:12,
        Q:'太低溫蜜蜂怎麼不太工作？',
        A:'義大利蜂的習性是室外溫度低於15度時就不太會外出訪花，因此如果環境溫度低於15度蜜蜂的活力就會明顯下降。'
    },
    {
        Type:1,
        Index:13,
        Q:'該如何幫蜜蜂保暖？',
        A:'可於蜂箱外蓋上不透風或可保溫的布，若遇上寒流(低於10度)可在紙蜂箱上放與外蓋的布中間放上一個24小時的暖暖包，讓蜜蜂渡過低溫環境。'
    },
    {
        Type:2,
        Index:14,
        Q:'移入後為什麼很少蜂會撞棚死亡？',
        A:'因為我們的操作方式會先將會撞棚死亡的外勤蜂先移除，所以移入的授粉蜂皆為內勤蜂，而只要是在溫網室內從內勤蜂轉變成外勤蜂的工蜂，就不會出現撞棚的行為。'
    },
    {
        Type:2,
        Index:15,
        Q:'為什麼使用一陣子後觀察到蜜蜂有撞棚行為？',
        A:'目前觀測到會出現這個現象的原因，是因為溫網室內食物不足，無法供應蜂群所需，因此工蜂會想飛出溫網室找尋新的食物來源，因此出現撞棚行為。'
    },
    {
        Type:2,
        Index:16,
        Q:'為什麼我的蜜蜂發生大量死亡？',
        A:'造成蜜蜂大量死亡的原因包含，使用農藥或蜜蜂採集到未乾的農藥、溫網室內食物不足、溫網室內氣溫太高而又沒有提供水源讓蜜蜂採水降溫。'
    },
    {
        Type:2,
        Index:17,
        Q:'為什麼比較不會螫人？',
        A:'傳統的蜂箱裡面含有幼蟲，當幼蟲肚子餓時會散發氣味讓工蜂出去採食物回來餵食，而如果無法滿足幼蟲需求，氣味一直存在，蜂群就會躁動變兇；而我們的無蜂王授粉技術，內不含幼蟲，因此會比較溫馴不螫人。'
    },
    {
        Type:2,
        Index:18,
        Q:'為什麼感覺蜜蜂訪花的數量比傳統的蜂箱少？',
        A:'我們的授粉蜂訪花的數量是和外在食物的多寡有關。蜜蜂有習性是自己出去採食物，如果食物過多採不完，他就會回家找同伴出來，所以環境食物充足的話，蜜蜂就會越來越多。目前我們記錄到最多的是2分地的洋香瓜，同一時間有超過600隻蜜蜂在授粉。相反如果食物不足，蜜蜂自己能採完，他就會回家和同伴說不用出門了，因此出來的數量就會減少，只會偶爾看到幾隻出來巡有沒有新的食物。但傳統的蜂箱因為有幼蟲肚子餓散發的氣味逼者工蜂出門採食，所以就算外在環境沒有食物了，也會看到很多工蜂在訪花找尋食物。'
    },
    {
        Type:2,
        Index:19,
        Q:'移入後要幾天才會出來授粉？',
        A:'由於我們移入的授粉蜂皆是內勤蜂，因此從內勤蜂轉變成出來工作的外勤蜂需要幾天的時間，經過統計平均3~5天左右就會開始出來工作。'
    },
    {
        Type:3,
        Index:20,
        Q:'建議2分地使用一箱的作物為何？',
        A:'洋香瓜、美濃瓜、草莓、大黃瓜、小黃瓜、櫛瓜、藍莓。未列出的作物是尚未經過測試，可直接與負責人詢問。'
    },
    {
        Type:3,
        Index:21,
        Q:'建議1分地使用一箱的作物為何？',
        A:'絲瓜、苦瓜。此兩種作物同時間花朵數量較多，因此1分地需使用1箱。'
    },


    
    
]
const testDataDealed = [
    {
        ID:1,
        UserName: 'Andrew',
        Phone : '0912334556',
        Email : 'AndrewQQ@gmail.com',
        Products: '韭菜',
        Duration: 10,
        Hectare: 25,
        Amount: 7, 
        County: '台南市',
        Address: '台南市善化區寶興街128巷5號',
        ReleaseDate: '2022-12-23',
        AcceptDate: '2022-11-23',
        Special: '不想當韭菜QQ',
        Dealed: 1,
        Staff: 'Micheal',
        Person: person1,
    },
    {
        ID:2,
        UserName: 'Jim',
        Phone : '0934544556',
        Email : 'JimQQ2@gmail.com',
        Products: '芭樂',
        Duration: 5,
        Hectare: 43,
        Amount: 2, 
        County: '桃園市',
        Address: '桃園市龍潭區水果街78巷87號',
        ReleaseDate: '2022-12-12',
        AcceptDate: '2022-11-7',
        Special: '芭樂籽好多，不喜歡',
        Dealed: 1,
        Staff: 'Eric',
        Person: person2,

    },
    {
        ID:3,
        UserName: 'Scott',
        Phone : '0978514223',
        Email : 'scottQQgummy@gmail.com',
        Products: '龍眼',
        Duration: 3,
        Hectare: 70,
        Amount: 4, 
        County: '新北市',
        Address: '新北市汐止區鹹蛋街12巷8號',
        ReleaseDate: '2022-12-11',
        AcceptDate: '2022-09-17',
        Special: '龍眼曬乾就是桂圓',
        Dealed: 1,
        Staff: 'Eric',
        Person: person3,
    },
    {
        ID:4,
        UserName: 'JH',
        Phone : '0932456654',
        Email : 'JHQQ4@gmail.com',
        Products: '番茄',
        Duration: 3,
        Hectare: 43,
        Amount: 6, 
        County: '台中市',
        Address: '台中市西區考克街1巷118號',
        ReleaseDate: '2022-10-11',
        AcceptDate: '2022-09-14',
        Special: '不知道家鴻的英文名字叫什麼',
        Dealed: 1,
        Staff: 'WenWen',
        Person: person4,
    },
    {
        ID:5,
        UserName: 'Jason',
        Phone : '0931345434',
        Email : 'JasonQQall@gmail.com',
        Products: '茶葉',
        Duration: 3,
        Hectare: 23,
        Amount: 2, 
        County: '桃園市',
        Address: '桃園市中壢區健康路93號',
        ReleaseDate: '2022-10-02',
        AcceptDate: '2022-07-18',
        Special: 'Jason Yeh 健康好青農',
        Dealed: 1,
        Staff: 'WenWen',
        Person: person5,
    },
    {
        ID:6,
        UserName: 'Jim',
        Phone : '0934544556',
        Email : 'JimQQ2@gmail.com',
        Products: '芭樂',
        Duration: 5,
        Hectare: 43,
        Amount: 4, 
        County: '桃園市',
        Address: '桃園市龍潭區水果街78巷87號',
        ReleaseDate: '2022-09-12',
        AcceptDate: '2022-05-7',
        Special: '芭樂籽好多，不喜歡',
        Dealed: 1,
        Staff: 'Eric',
        Person: person2,

    },
    {
        ID:7,
        UserName: 'Scott',
        Phone : '0978514223',
        Email : 'scottQQgummy@gmail.com',
        Products: '龍眼',
        Duration: 3,
        Hectare: 70,
        Amount: 2, 
        County: '新北市',
        Address: '新北市汐止區鹹蛋街12巷8號',
        ReleaseDate: '2022-08-19',
        AcceptDate: '2022-06-17',
        Special: '龍眼曬乾就是桂圓',
        Dealed: 1,
        Staff: 'Eric',
        Person: person3,
    },
    {
        ID:8,
        UserName: 'JH',
        Phone : '0932456654',
        Email : 'JHQQ4@gmail.com',
        Products: '番茄',
        Duration: 3,
        Hectare: 43,
        Amount: 1, 
        County: '台中市',
        Address: '台中市西區考克街1巷118號',
        ReleaseDate: '2022-08-11',
        AcceptDate: '2022-05-14',
        Special: '不知道家鴻的英文名字叫什麼',
        Dealed: 1,
        Staff: 'WenWen',
        Person: person4,
    },
    {
        ID:9,
        UserName: 'Jason',
        Phone : '0931345434',
        Email : 'JasonQQall@gmail.com',
        Products: '茶葉',
        Duration: 3,
        Hectare: 23,
        Amount: 5, 
        County: '桃園市',
        Address: '桃園市中壢區健康路93號',
        ReleaseDate: '2022-04-12',
        AcceptDate: '2022-03-12',
        Special: 'Jason Yeh 健康好青農',
        Dealed: 1,
        Staff: 'WenWen',
        Person: person5,
    },
    {
        ID:10,
        UserName: 'Andrew',
        Phone : '0912334556',
        Email : 'AndrewQQ@gmail.com',
        Products: '韭菜',
        Duration: 10,
        Hectare: 25,
        Amount: 1, 
        County: '台南市',
        Address: '台南市善化區寶興街128巷5號',
        ReleaseDate: '2022-12-24',
        AcceptDate: '2022-11-13',
        Special: '不想當韭菜QQ',
        Dealed: 0,
        Staff: 'Micheal',
        Person: person1,
    },
    {
        ID:11,
        UserName: 'Jim',
        Phone : '0934544556',
        Email : 'JimQQ2@gmail.com',
        Products: '芭樂',
        Duration: 5,
        Hectare: 43,
        Amount: 3, 
        County: '桃園市',
        Address: '桃園市龍潭區水果街78巷87號',
        ReleaseDate: '2022-12-23',
        AcceptDate: '2022-11-07',
        Special: '芭樂籽好多，不喜歡',
        Dealed: 0,
        Staff: 'Eric',
        Person: person2,

    },
    
];

const testDataUndealed = [
    {
        ID:1,
        UserName: 'Andrew',
        Phone : '0912334556',
        Email : 'AndrewQQ@gmail.com',
        Products: '韭菜',
        Duration: 10,
        Hectare: 25,
        Amount: 1, 
        County: '台南市',
        Address: '台南市善化區寶興街128巷5號',
        ReleaseDate: '2022-12-24',
        AcceptDate: '2022-11-13',
        Special: '不想當韭菜QQ',
        Dealed: false,
        Staff: 'Micheal',
        Person: person1,
    },
    {
        ID:2,
        UserName: 'Jim',
        Phone : '0934544556',
        Email : 'JimQQ2@gmail.com',
        Products: '芭樂',
        Duration: 5,
        Hectare: 43,
        Amount: 3, 
        County: '桃園市',
        Address: '桃園市龍潭區水果街78巷87號',
        ReleaseDate: '2022-12-23',
        AcceptDate: '2022-11-07',
        Special: '芭樂籽好多，不喜歡',
        Dealed: false,
        Staff: 'Eric',
        Person: person2,

    },
];

const cities = [
    {
      value: '台北市',
      label: '台北市',
    },
    {
      value: '新北市',
      label: '新北市',
    },
    {
      value: '基隆市',
      label: '基隆市',
    },
    {
      value: '桃園市',
      label: '桃園市',
    },
    {
        value: '新竹縣',
        label: '新竹縣',
    },
    {
        value: '苗栗縣',
        label: '苗栗縣',
    },
    {
        value: '台中市',
        label: '台中市',
    },
    {
        value: '彰化縣',
        label: '彰化縣',
    },
    {
        value: '南投縣',
        label: '南投縣',
    },
    {
        value: '雲林縣',
        label: '雲林縣',
    },
    {
        value: '嘉義縣',
        label: '嘉義縣',
    },
    {
        value: '台南縣',
        label: '台南縣',

    },
    {
        value: '高雄市',
        label: '高雄市',
    },
    {
        value: '屏東縣',
        label: '屏東縣',
    },
    {
        value: '宜蘭縣',
        label: '宜蘭縣',
    },
    {
        value: '花蓮縣',
        label: '花蓮縣',
    },
  ];
export {testDataDealed,testDataUndealed,cities,QAList,FAQ}