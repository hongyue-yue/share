import 'dart:math';

class PointA {
  final num x;
  final num y;
  final num distanceFromOrigin;

  PointA(x, y)
      : x = x,
        y = y,
        distanceFromOrigin = sqrt(x * x + y * y);
}
class PointB {
  num x;
  num y;
  PointB(this.x,this.y);
  PointB.b(Map json) {
    x = json['x'];
    y = json['y'];
  }
  String greet() => 'Hello, $x. I am $y.';
}
class Employee extends PointB{
   Employee(x,y):super(x,y);
   Employee.b(Map json):super.b(json);
}

class Persona {
  void greet(who){}
  //void add(int a,int b){}
}
class Personb {
  final name;
  Personb(this.name);
  String greet(who)=>'Hello,$name.';
  
}
class Imposter implements Persona,Personb{
   final name;
   Imposter(this.name);
   String greet(who) => 'Hello, $who. I am $name.';
   num add(int a,int b)=>a+b;
}
class A extends Imposter{
  A(name):super(name);
}
greetBob(Persona person) => person.greet('bob');
greetKit(Personb person) => person.greet('kit');

class Cache<T> {
  T name;
  num age;
  Cache(this.name,this.age);
  String greet()=>'$name age is $age';
}


