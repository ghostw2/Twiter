import React , { useEffect,useState} from 'react';
import { Button, Modal } from 'react-bootstrap';
import useAxios from '../helpers/axiosConfig';
const NewChatModal = ({id}) => {
  const [userList, setUserList] = useState([]);
  const [selected, setSelected] =  useState([id]);
    const [show, setShow] = useState(false);
    const handleClose = () => { setShow(false) }
    const handleShow = () => { setShow(true) }
    
  const axiosInstance = useAxios();
  
  useEffect(() => {
    axiosInstance.get('/users')
      .then((response) => {
      if (response.status === 200) {
        setUserList(response.data.users);
      }
            
      }).catch((e) => {
        alert(e.message);
      });
  }, [])
 
  const newChat = () => {
    axiosInstance.post('/chat/new',
      {
        recivers:selected
      }
    ).then(response => {
      console.log(response);
      if (response.data.error === false) handleClose();
    }).catch(e => {
      console.log(e.message)
    })
  }
  const toggleSelectUser = (userId) => {
    setSelected(prevSelected =>
      prevSelected.includes(userId)
        ? prevSelected.filter(id => id !== userId)
        : [...prevSelected, userId]
    );
  };
    
    return <>
         <button onClick={handleShow}>
                Open modal
              </button>
        <Modal show={show} onHide={handleClose}>
        <Modal.Header >
          <Modal.Title>this is the modal title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul className="list-group mt-4">
              {userList.map((user, index) => (
                <li role="button" onClick={(e) => { toggleSelectUser(user._id);e.target.classList.add('bg-success','text-light') } } className="list-group-item p-2"  key={user._id}>
                    {user.username}
                </li>
              ))}
            </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='primary' onClick={newChat}>Create new chat</Button>
          <Button variant="danger" onClick={handleClose}>close</Button>
        </Modal.Footer>
      </Modal>
    </>
}
export default NewChatModal;