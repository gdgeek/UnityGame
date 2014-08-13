#pragma strict
class EZFightInputState extends State{
	private var isOver_:boolean;
	private var context_:EZModelContext;
	private var task_:Task = null;

	
	
	public function EZFightInputState(task:Task, context:EZModelContext){
		context_ = context;  
		task_ = task;
	} 
	private function testCrystal():boolean{
	
		var battle:EZSoul = EZContainerManager.GetSoul(EZSoul.Seat.WeBattle);
		var crystal:EZModelCrystal = EZContainerManager.GetCrystal();
	
		if(battle && crystal &&  battle.group == crystal.group && crystal.filled){
			return true;
		}
			
		return false;
	}
	private function testAction(seat:EZSoul.Seat){
		
		return EZContainerManager.CanMagic(seat);
	
	}

	public function postEvent(evt:FSMEvent):String{
		Debug.Log(evt.msg);
		var ret:String = "";
		switch(evt.msg){ 
		case "action.bag1":
			if(testAction(EZSoul.Seat.WeBag1)){
				context_.action = evt.msg;
				ret = "fight.begin";
			}
			break; 
		case "action.bag2":
			if(testAction(EZSoul.Seat.WeBag2)){
				context_.action = evt.msg;
				ret = "fight.begin";
			} 
			break;
		case "attack":
		case "swap.bag1":
		case "swap.bag2":
			context_.action = evt.msg;
			ret = "fight.begin";
			break;
		
		case "action.crystal":
			if(testCrystal()){
				context_.action = "crystal";
				ret = "fight.begin";
			}
			break;
		case "foe.battle":
			foeSelect(EZSoul.Seat.FoeBattle);
			break;
		case "foe.bag1":
			foeSelect(EZSoul.Seat.FoeBag1);
			break;
		case "foe.bag2":
			foeSelect(EZSoul.Seat.FoeBag2);
			break;
		case "foe.battle.info":
		case "foe.bag1.info":
		case "foe.bag2.info":
		case "we.battle.info":
		case "we.bag1.info":
		case "we.bag2.info":
			
			context_.action = evt.msg;
			Debug.Log("cool:" + evt.msg);
			ret = "fight.info";
			break;
		case "open.select":
			EZPopCtrl.GetInstance().openSelect();
			Debug.Log("open");
			break;
		case "close.select":
			EZPopCtrl.GetInstance().closeSelect();
			Debug.Log("close");
			break;
		}
		return ret;
	}
	public function foeSelect(seat:EZSoul.Seat){
		Debug.Log(seat);
		var action:EZIDRetAction = ActionManager.Create("model.foe.select") as EZIDRetAction;
		action.id = seat;
		ActionManager.Run(action);
		ActionManager.Run("view.foe.selected.reset");
		if(action.ret){
			var select:EZIDAction = ActionManager.Create("view.foe.selected") as EZIDAction;
			select.id = seat;
			ActionManager.Run(select);	
		}
		
	}
	public function start(){
		Debug.Log("aaaaaaaaaaaaaaaaaaaa");
		var mt:MultiTask = new MultiTask();
	 	if(task_){
	 		mt.push(task_);
	 	}
		
		if(EZLeadManager.GetInstance()){
			EZLeadManager.GetInstance().next();
			var task:Task = EZLeadManager.GetInstance().lead();
			mt.push(task);
		}
		
		TaskManager.PushFront(mt,function(){
			if(EZCrystalInGame.GetInstance()){
				EZCrystalInGame.GetInstance().open();
			}
			EZPopCtrl.GetInstance().open();
		});
		
		TaskManager.PushBack(mt,function(){
			ActionManager.Run("view.input.enable");
		});
		
		TaskManager.Run(mt);
	}
	public function over(){
		EZPopCtrl.GetInstance().close();
		ActionManager.Run("view.input.disable");
		if(EZCrystalInGame.GetInstance()){
			EZCrystalInGame.GetInstance().close();
		}
		
	}
}