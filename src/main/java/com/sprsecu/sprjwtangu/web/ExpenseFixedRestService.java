package com.sprsecu.sprjwtangu.web;

import com.sprsecu.sprjwtangu.dao.ExpenseFixedRepository;
import com.sprsecu.sprjwtangu.entities.ExpenseFixed;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author vdnh
 * © Nhat Hung VO DINH
 */
@RestController
@CrossOrigin("*")
public class ExpenseFixedRestService {
    @Autowired
    private ExpenseFixedRepository expenseFixedRepository;

    @RequestMapping(value = "/expenseFixedOfOwner", method = RequestMethod.GET)
    public List<ExpenseFixed> expenseFixedOfOwner(@RequestParam(name = "idOwner") Long idOwner) 
    {
        return expenseFixedRepository.expenseFixedsOwner(idOwner);
    }    

    @RequestMapping(value = "/expenseFixed/{id}", method = RequestMethod.GET)
    public ExpenseFixed getExpenseFixed(@PathVariable Long id){
        return expenseFixedRepository.findById(id).get();
    }

    @RequestMapping(value = "/expenseFixed", method = RequestMethod.POST)
    public ExpenseFixed save(@RequestBody ExpenseFixed e){
        return expenseFixedRepository.save(e);
    }

    @RequestMapping(value = "/expenseFixed/{id}", method = RequestMethod.DELETE)
    public boolean supprimer(@PathVariable Long id){
        expenseFixedRepository.deleteById(id);
        return true;
    }

    @RequestMapping(value = "/expenseFixed", method = RequestMethod.DELETE)
    public boolean delete(@RequestParam(name = "id") Long id){
        expenseFixedRepository.deleteById(id);
        return true;
    }

    @RequestMapping(value = "/expenseFixed/{id}", method = RequestMethod.PUT)
    public ExpenseFixed updateExpenseFixed(@PathVariable Long id, @RequestBody ExpenseFixed e){
        e.setId(id);
        return expenseFixedRepository.save(e);
    }        
}