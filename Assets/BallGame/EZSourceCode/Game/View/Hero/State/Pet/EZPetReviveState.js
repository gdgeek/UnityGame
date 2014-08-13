#pragma strict

class EZPetReviveState extends StateWithEventMap{

	private var task_:Task = null;
	private var isOver_ = false;
	public function EZPetReviveState(task:Task){
		task_ = task;
		TaskManager.PushBack(task, function(){
			isOver_ = true;
		});
	}
	public function start(){
		isOver_ = false;
		TaskManager.Run(task_);
	}
	public function update(d:float){
		if(isOver_){
			Debug.LogWarning("weakup.idle");
			return "weakup.idle";
		}
		return "";
	}
	public function over(){
		
	}
}