import 'package:dart_hello/dart_hello.dart'  as hello ;
import 'package:dart_hello/point.dart';

void main() {
  /*var p = new PointA(2, 3);
  print('Hello world: ${hello.calculate()}!');
  print(p.distanceFromOrigin);*/
 
  //var b=new Employee.b({'x':4,'y':5});
 // print(b.greet());
  // print(greetBob(new Imposter('kathy')));
  // print(greetKit(new Imposter('fdsa')));
  //var a=new A('a');
  //print(a.add(1,2));
  
  var a=new List<Cache<String>>();
  a.add(new Cache<String>('fdsa',23));
  print(a[0].greet());
}

