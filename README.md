��#   A P I - P l u g i n  
 
POST { "consoleGroup" : "....", "uid" : "...." } /createdemo
Проверка: notifications =/ return (Демо доступ уже использован)
	ОК => FindConsole =/ return ('К сожалению все консоли заняты')
		OK = > резервируем консоль
			OK => UpdateVpncredentials(active = true);
				OK => CreateSubscript (на 30минут)
				return Status(200);


POST /createuser
Регистрирует пользователя и Vpncredentials;
	(отправка на почту в процесе)


POST {"body": Notifi, "user": id} /createnotifications
	Status(200);



POST {USER"id" : "..." "consoleGroup" "...", "paytyp": "..."} /payqiwi

updateConsole = false;
 payments = processing
 return (qiwi.com/payment/form/99?extra%5B%27) //ссылка для оплаты

 запуск PayCheck() => (
	SuccesPay => (
		createSubscript
		PaymentsUpdate = success
		UpdateVpncredentials = true;
	)

	Failed = > (
		PaymentsUpdate = Failed
		updateConsole = true;
	)

)	
