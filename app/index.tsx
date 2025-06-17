import { FlatList, Text, View, StyleSheet, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, Keyboard, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";  
import {Ionicons} from '@expo/vector-icons';  
import {Checkbox} from 'expo-checkbox';
import { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
// THIS SafeAreaView KEEPS ALL THE STUFF ISNIDE THE EYE RANGE OF PEOPLE BASICALLY BELOW THE NODGE LVL

type ToDoType = {
  id: number;
  title: string;
  isDone: boolean;
}

export default function Index() {

  const toDodData = [
    {
      id: 1,
      title: "Todo 1",
      isDone: false
    },
    {
      id: 2,
      title: "Todo 2",
      isDone: false
    },
    { 
      id: 3,
      title: "Todo 3",
      isDone: false
    },
    {
      id: 4,
      title: "Todo 4",
      isDone: false
    },
    {
      id: 5,
      title: "Todo 5",
      isDone: false
    },
    {
      id: 6,
      title: "Todo 6",
      isDone: false
    }
  ]

  const [toDos, setToDos] = useState<ToDoType[]>([]);
  const [toDoText, setToDoText] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [oldToDos, setOldToDos] = useState<ToDoType[]>([]);

  useEffect(() => {
    const getTodos = async() => {
      try {
        const todos = await AsyncStorage.getItem('my-todo');  // THIS FETCHES THE STORED DATA
        if(todos != null) {
          setToDos(JSON.parse(todos));
          setOldToDos(JSON.parse(todos));
        }
      } catch(error) {
        console.log(error)
      }
    };
    getTodos();
  }, []);

  const addToDo = async () => {
    try {
      const newTask = {
      id: Math.random(),
      title: toDoText,
      isDone: false
    };
    toDos.push(newTask);
    setToDos(toDos);
    setOldToDos(toDos);
    await AsyncStorage.setItem('my-todo', JSON.stringify(toDos));  // THIS STORES THE DATA 
    setToDoText('') // THIS CLEARS THE KEYBOARD AFTER ADDING A NEW TASK
    Keyboard .dismiss() // THIS CLOSES THE KEYBAORD AFTER ADDING A TASK
  }
  catch(error) 
  {
    console.log(error);
  }
}

const deleteToDo = async(id: number) => {
  try {
    const newTodos = toDos.filter((todo) => todo.id !== id);   
    await AsyncStorage.setItem('my-todo', JSON.stringify(newTodos));
    setToDos(newTodos);
    setOldToDos(newTodos);
  }
  catch(error) {
    console.log(error); 
  }
}

const handleDone = async (id: number) => {
  try {
    const newTodos = toDos.map((todo) => {
      if(todo.id === id) {
        todo.isDone = !todo.isDone;   
      }
      return todo;
    });
    await AsyncStorage.setItem('my-todo', JSON.stringify(newTodos));
    setToDos(newTodos);
    setOldToDos(newTodos);
  } catch(error) {
    console.log(error);
  }
};

const onSearch = (query: string) => {
  if(query == '')
  {
    setToDos(oldToDos);
  }
  else
  {
      const filteredTodos = toDos.filter((todo) => 
      todo.title.toLowerCase().includes(query.toLowerCase())
    );
    setToDos(filteredTodos);  
  }
};

useEffect(() => {
  onSearch(searchQuery);
}, [searchQuery])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>

         <TouchableOpacity onPress={() => {alert('Clicked!')}}>
         <Ionicons name="menu" size={24} color={'#333'} />   {/*  USED TO IMPORT ICONS */}
         </TouchableOpacity>

         <TouchableOpacity onPress={() => {}}>
         <Image source={require('../assets/images/profileimg.jpg')}
          style={{width: 40, height: 40, borderRadius: 50}}
         />
         </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name='search' size={24} color={'black'}  />
        <TextInput 
          placeholder="Search" 
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
          style={styles.searchInput} 
          clearButtonMode="always"    // THIS clearButtonMode imports a cross(X) icon in the searchbox whenever we try to start writing 
          />
      </View>

      <FlatList 
        data={[...toDos].reverse()} 
        keyExtractor={(item) => item.id.toString() }
        renderItem={({item}) => (
          <ToDoItem todo={item} deleteTodo={deleteToDo} handleTodo={handleDone}/>
        )}
      />

      <KeyboardAvoidingView style={styles.footer} behavior="padding" keyboardVerticalOffset={10}>
        {/* THIS KeyboardAvoidingView AVOIDS THE KEYBOARD TO OCCUPY THE ADD NEW TASK OPTION WITH THE HELP OF PADDING BEHAVIOUR*/}
        {/* keyboardVerticalOffset={10} THIS HELPS TO MAKE SOME SPACE B/W KEYBOARD AND THE ADD NEW TASK OPTION */}
        <TextInput placeholder="Add New Task" 
        value = {toDoText}
        onChangeText={(text) => setToDoText(text)} 
        style={styles.newInput}
        autoCorrect={false}
        />
        <TouchableOpacity style={styles.addButton} onPress={() => addToDo()}>
          <Ionicons name='add' size={28} color={'black'} />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const ToDoItem = ({
  todo, 
  deleteTodo,
  handleTodo
} : {
  todo: ToDoType;
  deleteTodo: (id: number) => void;
  handleTodo: (id: number) => void;
}) => {
  return (
    <View style={styles.toDoConatiner}>
          <View style={styles.toDoInfo}>
            <Checkbox 
            value={todo.isDone}     
            onValueChange={() => handleTodo(todo.id)}
            />        {/* THIS Chechbox CREATES A CHECKBOX ICON */}
            <Text style={[styles.todoText, todo.isDone && {textDecorationLine: 'line-through'}]}>{todo.title}</Text>        {/* THIS RENDER ITEM FETCHES THE toDoData ARRAY, BASICALLY DISPLATS THE LIST */}
          </View>
          <TouchableOpacity 
            onPress={() => {
              deleteTodo(todo.id);
              Alert.alert("Deleted"  + `Todo ID: ${todo.id}`)
            }}>
            <Ionicons name="trash" size={24} color={'red'}/>
          </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5'
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  searchBar: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems:'center',
    padding: 10,
    borderRadius: 50,
    gap: 5,
    marginBottom: 20
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: 'black'
  },
  toDoConatiner: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 50,
    marginBottom: 20,
    justifyContent: 'space-between'
  },
  toDoInfo: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center'
  },
  todoText: {
    fontSize: 16,
    color: 'black'
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  newInput: {
    backgroundColor: 'lightgrey',
    flex: 1,
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    color: 'black' 
  },
  addButton: {
    backgroundColor: 'lightgrey',
    padding: 8,
    borderRadius: 10,
    marginLeft: 20
  }
})