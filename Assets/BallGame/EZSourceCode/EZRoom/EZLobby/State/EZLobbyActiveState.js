﻿#pragma strict

class EZLobbyActiveState extends State{
	private var lobby_:EZLobbyCtrl = null;
	private var isOver_:boolean = false;
	public function EZLobbyActiveState(lobby:EZLobbyCtrl){
		lobby_ = lobby;
	}
	public function start(){
		Debug.Log("EZLobbyActiveState");
		isOver_ = false;
		
		var tl:TaskList = new TaskList();
		
		var mt:MultiTask = new MultiTask();
		
		var home:EZHomeTable = EZHomeTable.GetInstance();
		var loading:EZLoadingTask = TaskManager.Create("global.ui.loading") as EZLoadingTask;
		loading.time = 0.3;
		loading.alpha = 0.5;
		loading.text = EZDictionary.LookUp("!loading");
		mt.push(loading);
		mt.push(home.reload());
		tl.push(mt);
		var loaded:EZLoadedTask = TaskManager.Create("global.ui.loaded") as EZLoadedTask;
		loaded.time = 0.3;  
		
		TaskManager.PushFront(loaded, function(){
			lobby_.loadWeather();
			lobby_.loadOther();
			//lobby_.comeIn();
			//lobby_.guide.open();
		});
		
		tl.push(loaded);
		
		//tl.push(EZBroadcast.GetInstance().openTask(EZDictionaryScene.SceneName.Home));
		
		//TaskManager.PushFront(tl, function(){
			//var table:EZShopTable = EZShopTable.GetInstance();
			//if(!table.isLoaded){
			//	Debug.LogWarning("==========");
			//	table.runWait();
			//}
		//});
		
	
		TaskManager.PushBack(tl, function(){
			isOver_ = true;
		});
	
		TaskManager.Run(tl);
		
	}
	public function update(d:float):String{
		if(isOver_){
			
			return "play";
		}
		return "";
	}
}