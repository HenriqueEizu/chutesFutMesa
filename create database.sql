
create database futmesacartola;
use futmesacartola;
create table Usuario (
		US_USID int AUTO_INCREMENT PRIMARY KEY,
		US_USLOGIN  VARCHAR(300) not null,
        US_USSENHA  VARCHAR(8) not null,
        US_USATIVO  boolean,
        US_USNOMETRATAMENTO VARCHAR(300) not null,
        US_CLID int ,
        US_GUID int ,
        US_USEMAIL VARCHAR(300) not null,
        US_USDATACADASTRO  Date);
use futmesacartola;
create table Clubes (
		CL_CLID int AUTO_INCREMENT PRIMARY KEY,
		CL_CLNOME  VARCHAR(300) not null,
        CL_CLENDERECO  VARCHAR(300) null,
        CL_CLCIDADE VARCHAR(300) NULL,
        CL_CLUF VARCHAR(2) NULL,
        CL_CLATIVO  boolean,
        CL_CLSIGLA  VARCHAR(5) not null,
        CL_CLEMBLEMA VARCHAR(300) NULL ,
        CL_CLEMAIL VARCHAR(300) not null,
        CL_CLRESPONSAVEL VARCHAR(300) not null,
        CL_CLDATACADASTRO  Date,
        CL_CLTELEFONE varchar(300));

use futmesacartola;
create table estados (
		UF_UFID int AUTO_INCREMENT PRIMARY KEY,
		UF_UFNOME  VARCHAR(300) not null,
        UF_UFSIGLA  VARCHAR(300) null);
        
insert into estados (UF_UFNOME,UF_UFSIGLA)values ('AMAZONAS','AM') ;       
insert into estados (UF_UFNOME,UF_UFSIGLA) values ('PARA','PA');
insert into estados (UF_UFNOME,UF_UFSIGLA) values ('RONDONIA','RO');
insert into estados (UF_UFNOME,UF_UFSIGLA) values ('ACRE','AC');
insert into estados (UF_UFNOME,UF_UFSIGLA) values ('RORAIMA','RR');
insert into estados (UF_UFNOME,UF_UFSIGLA) values ('MATO GROSSO','MT');
insert into estados (UF_UFNOME,UF_UFSIGLA) values ('GOIAS','GO');
insert into estados (UF_UFNOME,UF_UFSIGLA) values ('MATO GROSSO DO SUL','MS');
insert into estados (UF_UFNOME,UF_UFSIGLA) values ('TOCANTINS','TO');
insert into estados (UF_UFNOME,UF_UFSIGLA) values ('AMAPA','AP');
insert into estados (UF_UFNOME,UF_UFSIGLA) values ('BRASILIA','DF');
insert into estados (UF_UFNOME,UF_UFSIGLA) values ('SÃO PAULO','SP');
insert into estados (UF_UFNOME,UF_UFSIGLA) values ('PARANA','PR');
insert into estados (UF_UFNOME,UF_UFSIGLA) values ('ESPIRITO SANTO','ES');
insert into estados (UF_UFNOME,UF_UFSIGLA) values ('RIO DE JANEIRO','RJ');
insert into estados (UF_UFNOME,UF_UFSIGLA) values ('MINAS GERAIS','MG');
insert into estados (UF_UFNOME,UF_UFSIGLA) values ('SANTA CATARINA','SC');
insert into estados (UF_UFNOME,UF_UFSIGLA) values ('RIO GRANDE DO SUL','RS');
insert into estados (UF_UFNOME,UF_UFSIGLA) values ('BAHIA','BA');
insert into estados (UF_UFNOME,UF_UFSIGLA) values ('ALAGOAS','AL');
insert into estados (UF_UFNOME,UF_UFSIGLA) values ('SERGIPE','SE');
insert into estados (UF_UFNOME,UF_UFSIGLA) values ('PERNAMBUCO','PE');
insert into estados (UF_UFNOME,UF_UFSIGLA) values ('PARAIBA','PB');
insert into estados (UF_UFNOME,UF_UFSIGLA) values ('RIO GRANDE DO NORTE','RN');
insert into estados (UF_UFNOME,UF_UFSIGLA) values ('CEARA','CE');
insert into estados (UF_UFNOME,UF_UFSIGLA) values ('MARANHÃP','MA');
insert into estados (UF_UFNOME,UF_UFSIGLA) values ('PIAUI','PI');
USE FUTMESACARTOLA;                
SELECT * FROM ESTADOS;        