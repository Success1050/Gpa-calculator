import { parse } from "postcss";
import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

// const Calculation = () => {
//   const [course, setCourse] = useState("");
//   const [gradeLetter, setGrade] = useState("");
//   const [unit, setUnit] = useState("");
//   return (
//     <div>
//       <CgpaCalculator
//         course={course}
//         gradeLetter={gradeLetter}
//         unit={unit}
//         setCourse={setCourse}
//         setGrade={setGrade}
//         setUnit={setUnit}
//       />
//     </div>
//   );
// };

const CgpaCalculator = () => {
  const addToLocalStorage = () => {
    const data = localStorage.getItem("list");
    let json = JSON.parse(data);
    if (json) {
      return json;
    }
    return [];
  };
  const addToLocalStorage1 = () => {
    const data = localStorage.getItem("totalpoint");
    let json = JSON.parse(data);
    return !isNaN(json) ? Number(json) : 0;
  };
  const addToLocalStorage2 = () => {
    const data = localStorage.getItem("totalunit");
    let json = JSON.parse(data);
    return !isNaN(json) ? Number(json) : 0;
  };

  const [student, setStudent] = useState(addToLocalStorage());
  const [course, setCourse] = useState("");
  const [grade, setGrade] = useState("");
  const [unit, setUnit] = useState("");
  // const [editIcon, setEditIcon] = useState();
  // const [deleteIcon, setDeleteIcon] = useState();
  const [totalUnit, setTotalUnit] = useState(addToLocalStorage2());
  const [totalPoint, setTotalPoint] = useState(addToLocalStorage1());
  const [avgGpa, setAvgGpa] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(student));
  }, [student]);

  useEffect(() => {
    localStorage.setItem("totalpoint", JSON.stringify(Number(totalPoint)));
  }, [totalPoint]);

  useEffect(() => {
    localStorage.setItem("totalunit", JSON.stringify(Number(totalUnit)));
  }, [totalUnit]);

  const editBtn = (id) => {
    const studentToEdit = student.find((pupil) => id === pupil.id);

    if (studentToEdit) {
      setIsEditing(true);
      setCourse(studentToEdit.course);
      setGrade(studentToEdit.grade);
      setUnit(studentToEdit.unit);
    }
  };

  const handleSubmit = () => {
    if (!course || !grade || !unit) {
      return alert("please fill in those information");
    }

    if (isEditing) {
      const updatedStudent = student.map((pupil) => {
        if (pupil.id === editId) {
          return { ...pupil, course: course, grade: grade, unit: unit };
        }
        return pupil;
      });
      setStudent(updatedStudent);
      setIsEditing(false);
      setEditId(null);

      const updatedTotalPoint = updatedStudent.reduce((total, pupil) => {
        return total + pupil.grade * pupil.unit;
      }, 0);

      const updatedTotalUnit = updatedStudent.reduce((total, pupil) => {
        return total + parseInt(pupil.unit, 10);
      }, 0);

      setTotalPoint(updatedTotalPoint);
      setTotalUnit(updatedTotalUnit);
    } else {
      const newStudent = {
        id: Date.now(),
        course: course,
        grade: grade,
        unit: unit,
      };
      setStudent((prev) => {
        return [...prev, newStudent];
      });
      const point = grade * unit;

      setTotalPoint((prev) => prev + Number(point));

      setTotalUnit((prev) => prev + Number(unit));
    }

    setCourse("");
    setGrade("");
    setUnit("");
  };

  const deleteBtn = (id) => {
    const deletedStudent = student.find((pupil) => id === pupil.id);

    // console.log(`id === pupil.id${deletedStudent}`);
    // console.log(
    //   "id !=== pupil.id" + "",
    //   student.find((pupil) => id !== pupil.id)
    // );

    if (!deletedStudent) return;

    const removedPoint = deletedStudent.grade * deletedStudent.unit;

    console.log(deletedStudent.unit);

    setTotalPoint((prev) => prev - parseInt(removedPoint, 10));
    setTotalUnit((prev) => prev - parseInt(deletedStudent.unit, 10));

    setStudent(student.filter((pupil) => id !== pupil.id));
  };

  const handleClear = () => {
    if (student.length >= 1) {
      setStudent([]);
      setTotalPoint(0);
      setTotalUnit(0);
    }
  };

  useEffect(() => {
    const gpa = totalPoint / totalUnit;

    setAvgGpa(() => {
      return gpa || 0;
    });
  }, [totalPoint, totalUnit]);

  return (
    <div className=' parent relative bg-slate-300 shadow-2xl'>
      <div className='header text-center bg-slate-200 py-3 '>
        <h2 className='text-2xl font-semibold'>CGPA CALCULATOR</h2>
      </div>

      <div className='calc flex justify-center gap-4 shadow-inner items-center my-8'>
        <div className='course bg-slate-200  '>
          <h2>Course</h2>
          <div>
            <input
              type='text'
              name='course'
              placeholder='feg101'
              value={course}
              onChange={(e) => {
                setCourse(e.target.value);
              }}
            />
          </div>
        </div>

        <div className='grade flex flex-col bg-slate-200 '>
          <label htmlFor='Grade'>Grade</label>
          <select
            value={grade}
            onChange={(e) => {
              setGrade(e.target.value);
            }}
          >
            <option value='' disabled selected>
              Select
            </option>
            <option value='5'>A</option>
            <option value='4'>B</option>
            <option value='3'>C</option>
            <option value='2'>D</option>
            <option value='1'>E</option>
            <option value='0'>F</option>
          </select>
        </div>

        <div className='unit flex flex-col bg-slate-200 '>
          <label htmlFor='Unit'>Unit</label>
          <select
            value={unit}
            onChange={(e) => {
              setUnit(e.target.value);
            }}
          >
            <option value='' disabled selected>
              Select
            </option>
            <option value='1'>1</option>
            <option value='2'>2</option>
            <option value='3'>3</option>
            <option value='4'>4</option>
            <option value='5'>5</option>
            <option value='6'>6</option>
            <option value='7'>7</option>
            <option value='8'>8</option>
            <option value='9'>9</option>
            <option value='10'>10</option>
          </select>
        </div>
      </div>
      <div
        className='add bg-green-500 w-20 text-black  text-center p-2 border-none outline-none border-b-neutral-600 shadow-xl  m-auto transition-all active:scale-90 rounded-md
      '
      >
        <button
          type='button'
          className='text-2xl font-medium'
          onClick={handleSubmit}
        >
          {isEditing ? "Edit" : "Add"}
        </button>
      </div>

      {/* the courses and the details */}
      <div className='flex justify-center flex-col items-center gap-6 mt-2 text-black '>
        <div className='courseheader flex justify-center mt-2 items-center gap-16'>
          <h3>Course</h3>
          <h3>Grade</h3>
          <h3>Unit</h3>
        </div>

        <div className='details flex flex-col gap-y-2'>
          {student.map((pupil) => {
            const { id, course, grade, unit } = pupil;
            return (
              <div key={id} className='flex justify-center gap-1'>
                <div className='result flex justify-center gap-20 ml-20'>
                  <p>{course}</p>
                  <p>{grade}</p>
                  <p>{unit}</p>
                </div>

                <div className='buttons flex justify-center items-center gap-2  ml-7'>
                  <button
                    type='button'
                    className='cursor-pointer outline-none border-none bg-green-400 p-2 text-xl font-medium rounded-md transition-all active:scale-90'
                    onClick={() => {
                      editBtn(id);
                      setEditId(id);
                    }}
                  >
                    <FaEdit />
                  </button>
                  <button
                    type='button'
                    className='cursor-pointer outline-none border-none bg-red-600 p-2 text-xl font-medium rounded-md transition-all active:scale-90'
                    onClick={() => {
                      deleteBtn(id);
                    }}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* the outputs */}
      <div className='scores mt-5 flex justify-center items-center gap-10'>
        <div className='  flex justify-center items-center'>
          <p className='point'>Total Point</p>
          <span className='totalPoint'>{totalPoint}</span>
        </div>
        <div className=' flex justify-center items-center'>
          <p className='unitScore'>Total Unit</p>
          <span className='totalPoint'>{totalUnit}</span>
        </div>
      </div>

      {/* average cgpa output */}
      <div className='flex justify-center items-center'>
        <p className='text-xl avg'>Average GPA</p>
        <span className='text-xl gpa'>{Math.round(avgGpa * 100) / 100}</span>
      </div>
      <p className='level text-center text-xl mb-2'>
        Grade :
        {(() => {
          if (avgGpa >= 4.5 || avgGpa === 5.0) {
            return "First-class";
          } else if (avgGpa >= 3.5 || avgGpa === 4.49) {
            return `2nd Class Upper`;
          } else if (avgGpa >= 2.4 || avgGpa === 3.49) {
            return `2nd Class Lower`;
          } else if (avgGpa >= 1.5 || avgGpa === 2.39) {
            return "3rd Class";
          } else if (avgGpa > 0 || avgGpa === 1.4) {
            return "Pass";
          }
        })()}
      </p>

      {student.length > 0 && (
        <div className=' clear bg-red-500 w-20 text-black  text-center p-2 border-none outline-none border-b-neutral-600 shadow-xl  transition-all active:scale-90 rounded-md m-auto '>
          <button
            type='button'
            className='text-2xl font-medium'
            onClick={handleClear}
          >
            Clear
          </button>
        </div>
      )}

      <h4 className='text-center text-2xl font-bold  '>Built By Success</h4>
    </div>
  );
};

export default CgpaCalculator;
