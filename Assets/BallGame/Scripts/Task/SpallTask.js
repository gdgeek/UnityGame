#pragma strict

	
class SpallTask extends Task {
	private var begin_:Vector3 = Vector3(0, 0, 0);
	private var end_:Vector3 = Vector3(0, 0, 0);
	private var allTime_:float = 1;
	private var time_:float = 0;
	private var position_ = Vector3(0,0,0);
	private var type_:Geek.MagicType = Geek.MagicType.None;
	private var object_:GameObject = null;
	private var parabola_:Vector3 = Vector3(0, 0, 0);
	private var scale_:Vector3= Vector3(0, 0, 0);
	private var prototype_:GameObject = null;
	function SpallTask(prototype:GameObject){
		this.prototype_ = prototype;
		this.init = this.initImpl;
		this.update = this.updateImpl;
		this.shutdown = this.shutdownImpl;
		this.isOver = this.isOverImpl;
	}
	function setBegin(begin:Vector3){
		this.begin_ = begin;
	}
	function setAllTime(allTime:float){
		this.allTime_ = allTime;
	}
	
	function setType(type:Geek.MagicType){
		this.type_ = type;
	}
	
	function setEnd(end:Vector3){
		this.end_ = end;
	}
	private function initImpl(){
		
		this.object_ = GameObject.Instantiate(this.prototype_);
		var magicColor:EZMagicTypeColor = this.object_.GetComponent(EZMagicTypeColor) as EZMagicTypeColor;
		if(magicColor != null){
			magicColor.setType(this.type_);
		}
		time_ = 0;
		this.position_.x = this.begin_.x;
		this.position_.y = this.begin_.y;
		this.position_.z = this.begin_.z;
		this.action(this.position_);
		if(this.begin_.x != this.end_.x || this.begin_.y != this.end_.y)
		{
			this.parabola_ = Geek.Parabola(Vector2(this.begin_.x, this.begin_.y), Vector2(this.end_.x, this.end_.y), Vector2(this.end_.x + (this.end_.x - this.begin_.x), this.end_.y - 200));
		}else{
			this.parabola_ = Vector3(0,0,0);
		}
		this.scale_ = this.object_.transform.localScale * (0.8 + Random.value* 0.4);
		this.object_.transform.Rotate(Vector3(0,0,360 * Random.value));
	}
	private function shutdownImpl(){
		this.position_.x = this.end_.x;
		this.position_.y = this.end_.y;
		this.position_.z = this.end_.z; 
		GameObject.DestroyObject(this.object_);
		
	}
	private function interpolation(a:float, b:float)
	{
		return a* (1- (this.time_/this.allTime_)) + b* (this.time_/this.allTime_);
	}
	private function updateImpl(d:float){
		this.time_ += d;
		
		var x = interpolation(this.begin_.x, this.end_.x);
		var y = 0;
		var z = interpolation(this.begin_.z, this.end_.z);
		if(this.parabola_ != Vector3(0,0,0)){
			y = Geek.ThrowParabola(this.parabola_, x);
		}
		var position = new Vector3(
		x, y, z
		);
		this.action(position);
		this.object_.transform.localScale = this.scale_ * (this.time_/2 +1);
		
	}

	
	
	function getAllTime(){
		return this.allTime_;
	}
	
	function isOverImpl(){
		var ret =  (this.time_ >= this.allTime_ + 1);
	
		return ret;
	
	}
	
	var action = function(position:Vector3){
		if(this.object_ != null)
		{
			this.object_.transform.position.x = position.x;
			this.object_.transform.position.y = position.y;	
			this.object_.transform.position.z = position.z;
		}
	};
	
	
};