
create database futmesacartola;
use futmesacartola;
create table Usuario (
		US_USID int AUTO_INCREMENT PRIMARY KEY,
		US_USLOGIN  VARCHAR(300) not null,
        US_USSENHA  VARCHAR(300) not null,
        US_USATIVO  boolean,
        US_USNOMETRATAMENTO VARCHAR(300) not null,
        US_CLID int ,
        US_GUID int ,
        US_USEMAIL VARCHAR(300) not null,
        US_USDATACADASTRO  Date);
ALTER TABLE Usuario ADD UNIQUE (US_USLOGIN);
ALTER TABLE Usuario ADD UNIQUE (US_USEMAIL);

use futmesacartola;
ALTER TABLE Usuario ADD CONSTRAINT FK_Usuario_Clube FOREIGN KEY (US_CLID) REFERENCES Clubes(CL_CLID); 
ALTER TABLE Usuario ADD CONSTRAINT FK_Usuario_Grupousuario FOREIGN KEY (US_GUID) REFERENCES GRUPOUSUARIO(GU_GUID);

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
ALTER TABLE Clubes ADD CONSTRAINT FK_Clube_Estados FOREIGN KEY (CL_CLUF) REFERENCES estados(UF_UFSIGLA);
use futmesacartola;
INSERT INTO CLUBES (CL_CLNOME,CL_CLENDERECO,CL_CLCIDADE,CL_CLUF,CL_CLATIVO,CL_CLSIGLA,CL_CLEMBLEMA,CL_CLEMAIL,CL_CLRESPONSAVEL,CL_CLDATACADASTRO,CL_CLTELEFONE )
VALUES ('Fedeeração Paulista de Futebol de Mesa','Rua Costa Aguiar, 232 - Ipiranga','São Paulo - Ipiranga','SP',1,'FPFM','assets/images/logos clubes/fpfm.png','FUTMESA@FUTMESA.COM.BR','FARAH12','2020-05-25','12121');

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

USE FUTMESACARTOLA; 
CREATE TABLE GRUPOUSUARIO 
(
	GU_GUID int AUTO_INCREMENT PRIMARY KEY,
	GU_GUDESCRICAO  VARCHAR(300) not null,
	CL_CLENDERECO  VARCHAR(300) null,
	GU_GUATIVO  boolean,
	CL_CLSIGLA  VARCHAR(5) not null,
	GU_GUDATACADASTRO  Date );

INSERT INTO grupousuario VALUES ('ADMINISTRADOR',1,NOW());
INSERT INTO grupousuario VALUES ('CLUBE',1,NOW());
INSERT INTO grupousuario VALUES ('USUARIO',1,NOW());
INSERT INTO grupousuario VALUES ('JOGADOR',1,NOW());

USE FUTMESACARTOLA;
CREATE TABLE Jogador (
        JO_JOID int AUTO_INCREMENT PRIMARY KEY,
        JO_JONOME VARCHAR(300) not null,
        JO_JOFOTO VARCHAR(300) ,
        JO_JOAPELIDO VARCHAR(50) not null,
        JO_JOATIVO boolean,
        JO_CLID int,
        JO_JODATACADASTRO Date
    );

USE FUTMESACARTOLA; 
ALTER TABLE Jogador ADD CONSTRAINT FK_Jogador_clubes FOREIGN KEY (JO_CLID) REFERENCES Clubes(CL_CLID);

USE FUTMESACARTOLA;
INSERT INTO Jogador ( JO_JONOME,JO_JOFOTO,JO_JOAPELIDO,JO_JOATIVO, JO_CLID,JO_JODATACADASTRO) VALUES ('Jorge Farah',null,'Farah', 1, 1, '2020-08-07');   

USE FUTMESACARTOLA;


