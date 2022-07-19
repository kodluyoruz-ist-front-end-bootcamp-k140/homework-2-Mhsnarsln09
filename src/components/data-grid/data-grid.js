import React, { useEffect, useState } from "react"
import { Button } from "../button"
import { FormItem } from "../form-item"
import { Pagination } from "../pagination"
import "./data-grid.css"

export function DataGrid() {

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [todo, setTodo] = useState(null)
  const [sorting, setSorting] = useState("ASC")
  
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(15)

  useEffect(() => {
    loadData()
  }, [itemsPerPage, setItemsPerPage])

  const indexofLastItems = currentPage * itemsPerPage
  const indexOfFirstItems = indexofLastItems - itemsPerPage
  const currentItems = items.slice(indexOfFirstItems, indexofLastItems)
  const totalPagesNum = Math.ceil(items.length/itemsPerPage)


  const loadData = () => {
    setLoading(true)
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then(x => x.json())
      .then(response => {
        setItems(response)
        setLoading(false)
    }).catch(e => {
      console.log(e)
      setLoading(false)
    })
  }

  const renderBody = () => {
    return (
      <React.Fragment>
        {currentItems.map((item, i) => {
          return (
            <tr key={i}>
              <th scope="row" >{item.id}</th>
              <td>{item.title}</td>
              <td>{item.completed ? "Tamamlandı" : "Yapılacak"}</td>
              <td>
                <Button className="btn btn-xs btn-danger" onClick={() => onRemove(item.id)}>Sil</Button>
                <Button className="btn btn-xs btn-warning" onClick={() => onEdit(item)}>Düzenle</Button>
              </td>
            </tr>
          )
        })}
      </React.Fragment>
    )
  }

  const renderTable = () => {
    return (
    <>
      <Button onClick={onAdd}>Ekle</Button>
      <table className="table">
        <thead>
          <tr>
            {/* Sorting */}
            <th scope="col" onClick={() => sortingId()}>#</th>
            <th scope="col" onClick={() => sortingTitle()}>Başlık</th>
            <th scope="col" onClick={() => sortingCompleted()}>Durum</th>
            <th scope="col">Aksiyonlar</th>
          </tr>
        </thead>
        <tbody>
          {renderBody()}
        </tbody>
      </table>
      
      <nav class="navbar navbar-light  justify-content-between">
      <div>
      <button type="button" className="btn btn-outline-primary" onClick={() => setItemsPerPage(() => {return 25;})}>25</button>
      <button type="button" className="btn btn-outline-primary" onClick={() => setItemsPerPage(() => {return 50;})}>50</button>
      <button type="button" className="btn btn-outline-primary" onClick={() => setItemsPerPage(() => {return 75;})}>75</button>
      <button type="button" className="btn btn-outline-primary" onClick={() => setItemsPerPage(() => {return 100;})}>100</button></div>
  <form class="form-inline">
  <Pagination pages={totalPagesNum} setCurrentPage ={setCurrentPage}/>
  </form>
</nav>
      
      
      
      
    </>
    )
  }
  // ****************** Sorting *******************

  
  const sortingId = () => {
    if (sorting === "ASC") {
      const sorted = [...items].sort((a, b) => (a.id < b.id ? -1 : 1));
      setSorting("DESC");
      setItems(sorted);
    } else {
      const sorted = [...items].sort((a, b) => (a.id > b.id ? -1 : 1));
      setSorting("ASC");
      setItems(sorted);
    }
  };

  const sortingTitle = () => {
    if (sorting === "ASC") {
      const sorted = [...items].sort((a, b) => (a.title < b.title ? -1 : 1));
      setSorting("DESC");
      setItems(sorted);
    } else {
      const sorted = [...items].sort((a, b) => (a.title > b.title ? -1 : 1));
      setSorting("ASC");
      setItems(sorted);
    }
  };

  const sortingCompleted = () => {
    if (sorting === "ASC") {
      const sorted = [...items].sort((a, b) => (a.completed < b.completed ? -1 : 1));
      setSorting("DESC");
      setItems(sorted);
    } else {
      const sorted = [...items].sort((a, b) => (a.completed > b.completed ? -1 : 1));
      setSorting("ASC");
      setItems(sorted);
    }
  };

  const saveChanges = () => {

    // insert 
    if (todo && todo.id === -1) {
      todo.id = Math.max(...items.map(item => item.id)) + 1;
      setItems(items => {
        items.push(todo)
        return [...items]
      })

      alert("Ekleme işlemi başarıyla gerçekleşti.")
      setTodo(null)
      return
    }
    // update
    const index = items.findIndex(item => item.id == todo.id)
    setItems(items => {
      items[index] = todo
      return [...items]
    })
    setTodo(null)
  }

  const onAdd = () => {
    setTodo({
      id: -1,
      title: "",
      completed: false
    })
  }

  const onRemove = (id) => {
    const status = window.confirm("Silmek istediğinize emin misiniz?")

    if (!status) {
      return
    }
    const index = items.findIndex(item => item.id == id)
    
    setItems(items => {
      items.splice(index, 1)
      return [...items]
    })
  }

  const onEdit = (todo) => {
    setTodo(todo)
  }
  
  const cancel = () => {
    setTodo(null)
  }

  const renderEditForm = () => {
    return (
      <>
        <FormItem
          title="Title"
          value={todo.title}
          onChange={e => setTodo(todos => {
            return {...todos, title: e.target.value}
          })}
        />
        <FormItem
          component="checkbox"
          title="Completed"
          value={todo.completed}
          onChange={e => setTodo(todos => {
            return {...todos, completed: e.target.checked}
          })}
        />
        <Button onClick={saveChanges}>Kaydet</Button>
        <Button className="btn btn-default" onClick={cancel}>Vazgeç</Button>
      </>
    )
  }
  
  return (
    <>
      { loading ? "Yükleniyor...." : (todo ? renderEditForm() : renderTable())}
    
    </>
  )
}