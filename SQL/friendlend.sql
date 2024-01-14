use FriendLend;

create table users(User_ID int primary key auto_increment, userName varchar(15) UNIQUE NOT NULL,
passwrd varchar(16) , Email varchar(30) UNIQUE NOT NULL, firstName varchar(15) , middleName varchar(15) ,  lastName varchar(15) NOT NULL,
gender varchar(6)NOT NULL,DOB date,
ID char(8) NOT NULL,
phone varchar(15) NOT NULL,rol char(10) NOT NULL);

alter table users add constraint check(rol in ("Admin","Lender","Borrower","Support"));

alter table users add constraint check(gender in("Male","Female"));

create table loan(app_ID varchar(30) primary key, user_ID int,loanAmount decimal(8,2),purpose varchar(30) NOT NULL,
term varchar(10) ,interestRate decimal(4,2),Date_applied datetime, date_approved_rejected datetime,approvalNotes text , State varchar(1));

alter table loan add constraint check(State in ("Approved","Pending","Rejected"));


create table contract(contract_ID int primary key , app_ID varchar(30), lender_ID int, borrower_ID int,repaymentPeriod int,
installmentAmount decimal(8,2) , interestRate decimal(4,2), State varchar(10), start_date date , end_date date, penalty_date decimal(4,2));

alter table contract add constraint check(State in ("Completed","Not Completed"));


create table payment(payment_id varchar(30) primary key, contract_ID int,paymentAmount decimal(8,2) ,
paymentDate date, State varchar(10), lateFee decimal(6,2));

create table transactions(trans_ID varchar(15) primary key, user_ID int, amount decimal(10,2) ,
transaction_type varchar(15), Description varchar(100) );


alter table transactions add constraint check( transaction_type in("Withdrawal","deposit","credited"));

create table credit(credit_id int primary key,user_ID int,score decimal(8,2) , date_calculated datetime default current_timestamp);

create table messages(message_ID varchar(30) primary key, sender_ID int, receiver_ID int,
subject varchar(100) , content text, date_send datetime default current_timestamp, state varchar(10));


alter table messages add constraint check (state in ("Read","Unread"));

create table documents(document_ID int primary key,user_ID int, document_type varchar(15) , fileName varchar(50)  NOT NULL,
date_uploaded datetime default current_timestamp);

alter table documents add constraint  check(document_type in ("ID_back","ID_front","bank","mpesa"));

create table systemLogs(log_ID int,user_ID int, action varchar(100) ,
date_actioned timestamp default current_timestamp,ip_address varchar(15));

create table Lender(lender_ID int primary key auto_increment,user_ID int,amount decimal(8,2),date_created datetime default current_timestamp, date_updated datetime default current_timestamp);
create table emergency(ID int primary key,firstName varchar(20) ,lastName varchar(20), phone varchar(15) UNIQUE,relationship varchar(20));

-- constraints  -- 

alter table emergency add column user_ID int,add constraint fk_em_us foreign key(user_ID) 
references useraccount(user_ID) on delete restrict on update cascade;

alter table Lender add constraint fk_ld_us foreign key(lender_Id) references useraccount(user_ID) on delete restrict on update cascade;

alter table documents add constraint fk_dc_us foreign key(user_ID) references userAccount(user_ID) on delete restrict on update cascade;

alter table loan add constraint fk_ln_us foreign key(user_ID) references useraccount(user_ID) on delete restrict on update cascade;

alter table contract add constraint fk_ct_ln foreign key(app_ID) references loan(app_ID) on delete restrict on update cascade;

alter table contract add constraint fk_ct_ld foreign key(lender_ID) references useraccount(user_ID) on delete restrict on update cascade, add constraint fk_ct_br 
foreign key(borrower_ID) references userAccount(user_ID) on delete restrict on update cascade;

alter table payment add constraint fk_py_ct foreign key(contract_ID) references contract(contract_ID) on delete restrict on update cascade;

alter table credit add constraint fk_cr_us foreign key(user_ID) references useraccount(user_ID) on delete restrict on update cascade;

alter table messages add constraint fk_ms_sd foreign key(sender_ID) references useraccount(user_ID) on delete restrict on update cascade, add 
constraint fk_ms_rc foreign key(receiver_ID) references useraccount(user_ID) on delete restrict on update cascade;

alter table systemLogs add constraint fk_sy_us foreign key(user_ID) references useraccount(user_ID) on update cascade ;

alter table transactions add constraint fk_tr_us foreign key(user_ID) references useraccount(user_ID) on delete restrict on update cascade;
use friendlend;

delete  from useraccount;

select * from useraccount;

alter table useraccount modify token text;
select token from useraccount where user_ID=2;


alter table emergency modify ID int auto_increment;
