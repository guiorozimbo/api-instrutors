const { request, response } = require("express");
const express = require("express");
const app = express();
app.use(express.json())

const instructors = []
const courses = []

//middleware para verificar se o instrutor ja esta cadastrado, caso esteja retorna (response) dizendo que ja existe
//senao retorna com o (next/rota original) para realizar o cadastro do instutor
function verifyIfExistsInstructorEmployeeRegistration(request,response,next){
    const {employeeregistration} = request.headers;
    const instructor = instructors.some((instructor) => instructor.employeeregistration === employeeregistration)
    if(instructor){
        return response.status(400).json({error: "Instructor alredy exists"})
    }
    return next()
}

function verifyIfExistsCoursesId(request,response,next){
    const {id} = request.headers;
    const course = courses.some((course) => course.id === id)
    if(course){
        return response.status (400).json({error: "Course alredy exists"})
    }
    return next()
}

//middleware para encontrar um instrutor cadastrado, caso ele nao esteja retorna (response) dizendo que nao foi encontrado
//senao retorna com o (next/rota original) para realizar o vinculo da turma para o instrutor
function findInstructorEmployeeRegistration(request,response,next){
    const {employeeregistration} = request.headers
    const instructor = instructors.find((instructor)=> instructor.employeeregistration === employeeregistration)
    if(!instructor){
        return response.status(400).json({error: "Instructor not found"})
    }
    request.instructor = instructor
    next()
}

//middleware para encontrar uma turma cadastrada, caso ela nao esteja retorna (response) dizendo que nao foi encontrada
//senao retorna com o (next/rota original) para realizar o vinculo desta turma para o instrutor
function findCourseId(request,response,next){
    const {id} = request.body
    const course = courses.find((course)=> course.id === id)
    if(!course){
        return response.status(400).json({error: "Course not found"})
    }
    request.course = course
    next()
}

//Middleware  para verificar se o curso esta cadastrado junto a um instrutor caso ele  estiver 
//cadastro ele ira retornar um true e não cadastrado ira retornar um true 
function findInstructorId(request,response,next){
    const {instructor} = request
     const {id} = request.body
     const instructorr = instructor.courses.some((instructor)=> instructor === id )
    if(instructorr){
        return response.status(400).json({error: "Course already registered"})
     }
    next()
}
/*function findIdInstructor(request,response,next){
    const {instructor} = request
    const {id} = request.body
    const instructorr = instructor.courses.some((instructor)=> instructor. id )
   if(instructorr){
       return response.status(400).json({error: "Course already registered"})
    }
   next()
}*/

function checkIfInstructorRecordExists(request,response,next){
    const {employeeregistration} = request.headers
    const instructor = instructors.some((instructor) => instructor.employeeregistration === employeeregistration)
    if(!instructor){
        return response.status(400).json({error: "register not found"})
    }

    next()
}

// verifica se a um instrutor cadastrado com o nome mandado o comando irá continuar  caso for diferente  irá aparecer a mensagen
//cpf not found
function checkIfInstructorCpfExists (request,response,next){
    const {cpf} = request.headers
    const instructor= instructors.some((instructor) => instructor.cpf === cpf)
    if(!instructor){
        return response.status(400).json({error: "cpf not found"})
    }

    next()
} 

// verifica se a um instrutor cadastrado com o nome mandado o comando irá continuar  caso for diferente  irá aparecer a mensagen
//name not found
function checkIfInstructorNameExists (request,response,next){
    const {name} = request.body
    const instructor = instructors.some((instructor) => instructor.name === name)
    if(!instructor){
        return response.status(400).json({error: "name not found"})
    }

    next()
} 

// verifica se a um curso cadastrado com o ID mandado o comando irá continuar  caso for diferente  irá aparecer a mensagen
//curso not found
function checkIfCourseExists(request,response,next){
    const {id} = request.body
    const course = courses.some((course) => course.id === id)
    if(!course){
        return response.status(400).json({error: "course not found"})
    }

    next() 
}
function verifyEmployee(request,response,next){
    const{employeeRegistration}=request.body
    const employee = instructors.find((employee) => employee.employeeregistration === employeeRegistration)
    if(!employee){
        return response.status(400).json({error: "Instructor alredy exists"})
    }
    return next()
}

// Rota para cadastrar um instrutor caso ele ainda nao tenha sido cadastrado
app.post("/instructor",verifyIfExistsInstructorEmployeeRegistration,(request,response) => {
    const {name,email, birthdate, cellphone} = request.body
    const {cpf,employeeregistration,password} = request.headers
    instructors.push  ({
        name,
        employeeregistration,
        cpf,
        email,
        birthdate,
        cellphone,
        courses:[],
        password,
        created_at : new Date()
        });
    return response.status(201).send()
})

//Retorna lista com todos os instrutores cadastrados
app.get ("/instructor",(request,response)=>{
    return response.json(instructors)
})

//Buscar instrutor pelo Registro
app.get("/instructor/registro",checkIfInstructorRecordExists,(request,response)=>{
    return response.send(instructors)
})

// Buscar instrutor pelo CPF
app.get("/instructor/cpf",checkIfInstructorCpfExists,(request,response)=>{
    return response.send(instructors)
})

//Buscar instrutor pelo nome
app.get("/instructor/name",checkIfInstructorNameExists,(request,response)=>{
    return response.send(instructors)
})
app.get("/instructor/allcourses",findInstructorEmployeeRegistration,(request,response)=>{
    const{instructor}=request
    const index = instructors.some((instructor) => instructor.courses)
    if(index){
        return response.status(200).json(index)
    }
    return response.json("courses not found!")
})
app.get("/instructor/onecourse",findInstructorEmployeeRegistration,(request,response)=>{
    const{id}=request
    const{instructor}=request
    const index = instructors.filter(() => instructor.courses)
    if(index){
        return response.status(200).json(index)
    }
    return response.json(id.courses)
})

// fazer Update de uma  conta (email, telefone, nome,data aniversario)
app.put("/instructor/update",findInstructorEmployeeRegistration,(request,response)=>{
    const {name,email,birthdate,cellphone} = request.body
    //console.log(name,email,birthdate,cellphone)
    const {instructor} = request
    instructor.name = name;
    instructor.email = email;
    instructor.birthDate = birthdate;
    instructor.cellPhone = cellphone;
    return response.status(204).send()


})
app.patch("/instructor/modify",findInstructorEmployeeRegistration,(request,response)=>{
const{instructor}=request
const {password} = request.headers
    
    instructor.password=password;
    return response.status(200).send()
})

app.patch("/instructor/updatepassword",checkIfInstructorRecordExists,(request,response)=>{
    const{password} = request.body;
    const {instructors} = request;
    console.log(instructors)
    instructors.password = password
    return response.status(204).send() 

})

//seleciona um instrutor pelo seu registro e o deleta
app.delete("/instructor",checkIfInstructorRecordExists,(request,response)=>{
    const{employeeRegistration} = request.headers
    const index = instructors.findIndex(instructors => instructors.employeeRegistration === employeeRegistration);
    instructors.splice(index,1)
    return response.status(204).send()
})

// Deve ser possível cadastrar turmas
app.post("/course",verifyIfExistsCoursesId,(request,response) => {

    const {name} = request.body
    const{ id } = request.headers

    courses.push  ({
            name,
            id ,
            created_at : new Date()
        });

    return response.status(201).send();

})

// Verificar todas as classes cadastradas
app.get ("/course",(request,response)=>{
    response.send(courses)
})

// seleciona um curso pelo seu id e o deleta
app.delete("/course", checkIfCourseExists,(request,response)=>{
    const{id} = request.headers
    const index = courses.find(courses => courses.id === id);
    if(instructors === id){
        return response.status(400).json({error: "curso cadastrado a um instrutor"})
    }
    courses.splice(index,1)
    return response.status(204).send()
})
app.delete("/course/delete",checkIfCourseExists,(request,response)=>{
    const{id} = request.body
    const index = courses.find(courses => courses.id === id);
    if(instructors ===id ){
        return response.status(400).json({error: "curso cadastrado a um instrutor"})
    }
    courses.splice(index,1)
    return response.status(204).send()
})
// faz o cadastro de um curso a um instrutor 
app.post("/instructor/course",findInstructorEmployeeRegistration,findCourseId,findInstructorId,(request,response)=>{
    const {instructor} = request
    const {id} = request.body
    instructor.courses.push(id)
    return response.status(201).send(courses);
})

app.listen(3333)